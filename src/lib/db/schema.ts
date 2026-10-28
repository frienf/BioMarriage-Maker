import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

/**
 * Two tables, deliberately.
 *
 * ponytail: the Phase 1 design had seventeen, including a render-queue table
 * and a versioned price table. The catalogue and its prices live in code
 * (src/templates/catalog.ts) and the PDF renders on demand, so neither is
 * needed at a planning ceiling of about 1,000 renders a day. Add the queue
 * table back when a render takes long enough that a request should not wait
 * for it, and the price table when prices must change without a deploy.
 *
 * The price actually charged is still stored on the order, because that must
 * be immutable whatever the catalogue says later.
 */

export const orders = pgTable(
  'orders',
  {
    id: text('id').primaryKey(),
    orderNumber: text('order_number').notNull(),

    /** 160 bits of randomness. The only key to this order; never an index. */
    token: text('token').notNull(),

    templateSlug: text('template_slug').notNull(),
    docLocale: text('doc_locale').notNull(),
    accent: text('accent'),

    /** Integer paise, as charged. Never recomputed from the catalogue. */
    pricePaise: integer('price_paise').notNull(),

    status: text('status').notNull().default('awaiting_payment'),
    razorpayOrderId: text('razorpay_order_id'),
    razorpayPaymentId: text('razorpay_payment_id'),

    /** The biodata itself. Erased in place on deletion, row kept for accounts. */
    biodata: jsonb('biodata'),

    pdfStatus: text('pdf_status').notNull().default('none'),
    pdfPath: text('pdf_path'),

    downloadsUsed: integer('downloads_used').notNull().default(0),
    downloadLimit: integer('download_limit').notNull().default(5),
    editsUsed: integer('edits_used').notNull().default(0),
    editLimit: integer('edit_limit').notNull().default(2),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true })
  },
  (t) => [
    uniqueIndex('orders_token_idx').on(t.token),
    uniqueIndex('orders_number_idx').on(t.orderNumber),
    index('orders_expires_idx').on(t.expiresAt),
    // The state machine, enforced by the database and not only by the code
    // that happens to be running.
    check('orders_status_check', sql`${t.status} in ('awaiting_payment','paid','failed','refunded')`),
    check('orders_pdf_status_check', sql`${t.pdfStatus} in ('none','rendering','ready','failed')`),
    check('orders_locale_check', sql`${t.docLocale} in ('en','hi','mr')`),
    check('orders_price_check', sql`${t.pricePaise} > 0`),
    check('orders_downloads_check', sql`${t.downloadsUsed} >= 0 and ${t.downloadsUsed} <= ${t.downloadLimit}`),
    check('orders_edits_check', sql`${t.editsUsed} >= 0 and ${t.editsUsed} <= ${t.editLimit}`),
    // Paid means paid: a paid order must carry the payment it was paid with.
    check(
      'orders_paid_has_payment',
      sql`${t.status} <> 'paid' or (${t.razorpayPaymentId} is not null and ${t.paidAt} is not null)`
    )
  ]
);

/**
 * Razorpay retries webhooks. Writing the delivery id here first is what stops
 * one payment being counted twice.
 */
export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: text('id').primaryKey(),
    provider: text('provider').notNull(),
    eventId: text('event_id').notNull(),
    payload: jsonb('payload').notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [uniqueIndex('webhook_provider_event_idx').on(t.provider, t.eventId)]
);

export type OrderRow = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
