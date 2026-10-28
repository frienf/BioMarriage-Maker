import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { and, eq, isNull, lt, sql } from 'drizzle-orm';
import { getDb } from './db/index.ts';
import { orders, type OrderRow } from './db/schema.ts';
import { orderNumber, purchaseToken } from './ids.ts';
import { pdfPathFor } from './pdf.ts';
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
 * Takes one download from the allowance, atomically.
 *
 * Written as a single conditional UPDATE so two taps on the download button at
 * the same moment cannot both pass a check-then-write.
 */
export async function consumeDownload(token: string): Promise<OrderRow | null> {
  const db = getDb();
  const [row] = await db
    .update(orders)
    .set({ downloadsUsed: sql`${orders.downloadsUsed} + 1` })
    .where(
      and(
        eq(orders.token, token),
        eq(orders.status, 'paid'),
        isNull(orders.deletedAt),
        sql`${orders.downloadsUsed} < ${orders.downloadLimit}`,
        sql`${orders.expiresAt} > now()`
      )
    )
    .returning();
  return row ?? null;
}

/**
 * Never touches an erased order, so a render that finishes after erasure
 * cannot mark it ready again. Returns false when the order is erased (or
 * unknown), which is how the download route learns its file must go.
 */
export async function setPdfStatus(token: string, pdfStatus: 'none' | 'rendering' | 'ready' | 'failed', pdfPath?: string) {
  const db = getDb();
  const rows = await db
    .update(orders)
    .set({ pdfStatus, ...(pdfPath ? { pdfPath } : {}) })
    .where(and(eq(orders.token, token), isNull(orders.deletedAt)))
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
  const db = getDb();
  const [row] = await db
    .update(orders)
    .set({ biodata: null, pdfStatus: 'none', pdfPath: null, deletedAt: new Date() })
    .where(and(eq(orders.token, token), isNull(orders.deletedAt)))
    .returning();
  // The cached PDF is the same personal details, so it goes too. The path is
  // built from the stored token, never the caller's, so a crafted token from
  // the URL cannot point rm anywhere. A download mid-render when this lands
  // removes its own file once setPdfStatus refuses it.
  if (row) await rm(pdfPathFor(row.token), { force: true });
  return row ?? null;
}

/** Everything past its retention date and not yet erased. Used by the sweeper. */
export async function expiredOrders(now: Date = new Date()) {
  const db = getDb();
  return db
    .select()
    .from(orders)
    .where(and(lt(orders.expiresAt, now), isNull(orders.deletedAt)));
}
