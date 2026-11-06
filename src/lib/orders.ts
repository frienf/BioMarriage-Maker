import { randomUUID } from 'node:crypto';
import { and, eq, isNotNull, isNull, lt, or, sql } from 'drizzle-orm';
import { getDb } from './db/index.ts';
import { orders, type OrderRow } from './db/schema.ts';
import { orderNumber, purchaseToken } from './ids.ts';
import { removeOrderPdfs } from './pdf-store.ts';
import type { Biodata } from './biodata.ts';
import { templateBySlug } from '../templates/catalog.ts';

/** How long a purchase stays usable. Matches what the privacy page promises. */
export const RETENTION_DAYS = 14;

export async function createOrder(data: Biodata, accent: string | null) {
  const def = templateBySlug(data.templateSlug);
  if (!def) throw new Error(`Unknown template: ${data.templateSlug}`);

  const db = getDb();
  const token = purchaseToken();
  const [row] = await db
    .insert(orders)
    .values({
      id: randomUUID(),
      orderNumber: orderNumber(),
      token,
      templateSlug: def.slug,
      docLocale: data.docLocale,
      accent,
      // Priced from the catalogue here and then never again: whatever the
      // catalogue says later, this order was sold at this price.
      pricePaise: def.pricePaise,
      status: 'awaiting_payment',
      biodata: data
    })
    .returning();
  return row;
}

export async function orderByToken(token: string): Promise<OrderRow | null> {
  const db = getDb();
  const [row] = await db.select().from(orders).where(eq(orders.token, token)).limit(1);
  return row ?? null;
}

export async function attachRazorpayOrder(token: string, razorpayOrderId: string) {
  const db = getDb();
  await db.update(orders).set({ razorpayOrderId }).where(eq(orders.token, token));
}

/**
 * Marks an order paid, once.
 *
 * The `status = 'awaiting_payment'` in the WHERE clause is the whole point: the
 * Checkout callback and the webhook both land here, often at the same time, and
 * only one of them may win.
 */
export async function markPaid(razorpayOrderId: string, razorpayPaymentId: string): Promise<OrderRow | null> {
  const db = getDb();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const [row] = await db
    .update(orders)
    .set({ status: 'paid', razorpayPaymentId, paidAt: now, expiresAt })
    .where(and(eq(orders.razorpayOrderId, razorpayOrderId), eq(orders.status, 'awaiting_payment')))
    .returning();
  return row ?? null;
}

/**
 * Authorizes a successfully rendered revision and consumes one download.
 *
 * Written as a single conditional UPDATE so two taps on the download button at
 * the same moment cannot both pass a check-then-write.
 */
export async function consumeDownload(token: string, revision: number): Promise<OrderRow | null> {
  return getDb().transaction(async (tx) => {
    // Acquire the lock first: expiry must be evaluated after any lock wait.
    const [locked] = await tx.select({ token: orders.token }).from(orders)
      .where(eq(orders.token, token)).for('update');
    if (!locked) return null;
    const [row] = await tx
      .update(orders)
      .set({ downloadsUsed: sql`${orders.downloadsUsed} + 1`, pdfStatus: 'none', pdfPath: null })
      .where(
        and(
          eq(orders.token, token),
          eq(orders.editsUsed, revision),
          eq(orders.status, 'paid'),
          isNull(orders.deletedAt),
          sql`${orders.downloadsUsed} < ${orders.downloadLimit}`,
          sql`${orders.expiresAt} > clock_timestamp()`
        )
      )
      .returning();
    return row ?? null;
  });
}

/**
 * Only update a still-eligible revision. The download path does not persist
 * rendered PDFs; this helper remains for existing callers.
 */
export async function setPdfStatus(token: string, pdfStatus: 'none' | 'rendering' | 'ready' | 'failed', pdfPath?: string, revision = 0) {
  const db = getDb();
  const rows = await db
    .update(orders)
    .set({ pdfStatus, ...(pdfPath ? { pdfPath } : {}) })
    .where(and(eq(orders.token, token), eq(orders.editsUsed, revision), eq(orders.status, 'paid'),
      isNull(orders.deletedAt), sql`${orders.expiresAt} > now()`))
    .returning({ token: orders.token });
  return rows.length > 0;
}

/**
 * Erases the biodata in place and keeps the row.
 *
 * The row is what accounting and a refund need; the personal details are what
 * the visitor asked us to forget, so those are nulled rather than the record
 * deleted.
 */
export async function eraseOrder(token: string) {
  const [erased] = await getDb().update(orders)
    .set({ biodata: null, pdfStatus: 'none', pdfPath: null, deletedAt: new Date() })
    .where(and(eq(orders.token, token), isNull(orders.deletedAt))).returning();
  // Erasure commits before cleanup. Repeated sweeps also revisit deleted rows
  // after a crash or filesystem error between those operations.
  const row = erased ?? await orderByToken(token);
  if (row?.deletedAt) await removeOrderPdfs(row.token);
  return erased ?? null;
}

/** Also revisit erased rows to collect legacy orphans after a cleanup failure. */
export async function expiredOrders(now: Date = new Date()) {
  const db = getDb();
  return db
    .select()
    .from(orders)
    .where(or(and(lt(orders.expiresAt, now), isNull(orders.deletedAt)), isNotNull(orders.deletedAt)));
}
