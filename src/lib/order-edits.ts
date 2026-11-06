import { and, eq, isNull, sql } from 'drizzle-orm';
import { biodataSchema, checkBiodata, type Biodata } from './biodata.ts';
import { unsupportedIn } from './glyphs.ts';
import { getDb } from './db/index.ts';
import { orders, type OrderRow } from './db/schema.ts';
import { templateBySlug } from '../templates/catalog.ts';
import { validPhoto } from './photo-validation.ts';

type EditableOrder = Pick<OrderRow, 'status' | 'deletedAt' | 'expiresAt' | 'editsUsed' | 'editLimit' | 'templateSlug' | 'pricePaise' | 'biodata'>;
type EditDecision =
  | { kind: 'unavailable' }
  | { kind: 'conflict' }
  | { kind: 'invalid'; error: string }
  | { kind: 'noop' | 'update'; biodata: Biodata };

export function editableOrder(order: EditableOrder, now = new Date()): boolean {
  return order.status === 'paid' && order.deletedAt === null && order.expiresAt !== null &&
    order.expiresAt.getTime() > now.getTime() && order.editsUsed < order.editLimit;
}

type NoopState = { eligible: boolean | null; editsUsed: number; editLimit: number };
export function classifyNoop(state: NoopState | null, expectedRevision: number) {
  if (!state || state.eligible !== true) return { kind: 'unavailable' as const };
  if (state.editsUsed !== expectedRevision) return { kind: 'conflict' as const };
  return { kind: 'ok' as const, editsUsed: state.editsUsed, editLimit: state.editLimit };
}

/** Lock first, then check expiry using the current database clock. */
export async function confirmNoop(token: string, expectedRevision: number) {
  return getDb().transaction(async (tx) => {
    const [locked] = await tx.select({ token: orders.token }).from(orders)
      .where(eq(orders.token, token)).for('update');
    if (!locked) return classifyNoop(null, expectedRevision);
    const [state] = await tx.select({
      eligible: sql<boolean | null>`${orders.status} = 'paid' and ${orders.deletedAt} is null and ${orders.expiresAt} > clock_timestamp() and ${orders.editsUsed} < ${orders.editLimit}`,
      editsUsed: orders.editsUsed,
      editLimit: orders.editLimit
    }).from(orders).where(eq(orders.token, token));
    return classifyNoop(state ?? null, expectedRevision);
  });
}

export async function prepareOrderEdit(order: EditableOrder, body: unknown, now = new Date()): Promise<EditDecision> {
  if (!editableOrder(order, now)) return { kind: 'unavailable' };
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { kind: 'invalid', error: 'Send biodata and a revision.' };
  const payload = body as { biodata?: unknown; expectedRevision?: unknown };
  if (typeof payload.expectedRevision !== 'number' || !Number.isSafeInteger(payload.expectedRevision) || payload.expectedRevision < 0) {
    return { kind: 'invalid', error: 'Send a valid revision.' };
  }
  if (payload.expectedRevision !== order.editsUsed) return { kind: 'conflict' };
  const parsed = biodataSchema.safeParse(payload.biodata);
  if (!parsed.success || checkBiodata(parsed.data, now).length) return { kind: 'invalid', error: 'Those details cannot be published.' };
  const data = parsed.data;
  const { photo: _photo, ...text } = data;
  if (unsupportedIn(text).length) return { kind: 'invalid', error: 'Some characters cannot be printed.' };
  const template = templateBySlug(data.templateSlug);
  if (!template || !template.docLocales.includes(data.docLocale)) return { kind: 'invalid', error: 'Choose a compatible template and language.' };
  if (template.slug !== order.templateSlug && template.pricePaise > order.pricePaise) return { kind: 'invalid', error: 'This template costs more than the original purchase.' };
  const previous = biodataSchema.safeParse(order.biodata);
  if (previous.success && JSON.stringify(previous.data) === JSON.stringify(data)) return { kind: 'noop', biodata: data };
  if (!(await validPhoto(data.photo.src))) return { kind: 'invalid', error: 'Replace or remove the photo; use a valid JPEG, PNG or WebP image.' };
  return { kind: 'update', biodata: data };
}

/** Bound bytes as they arrive, independently of the Content-Length header. */
export async function readEditBody(stream: ReadableStream<Uint8Array> | null): Promise<
  { kind: 'ok'; body: unknown } | { kind: 'invalid' } | { kind: 'too-large' }
> {
  if (!stream) return { kind: 'invalid' };
  const reader = stream.getReader();
  const limit = 4_100_000;
  const bytes = Buffer.allocUnsafe(limit);
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value.byteLength > limit - length) {
        void reader.cancel().catch(() => {});
        return { kind: 'too-large' };
      }
      bytes.set(value, length);
      length += value.byteLength;
    }
    const json = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, length));
    return { kind: 'ok', body: JSON.parse(json) };
  } catch {
    return { kind: 'invalid' };
  } finally {
    reader.releaseLock();
  }
}

/** Revision and eligibility are checked in the same statement as the write. */
export async function updatePaidOrder(token: string, expectedRevision: number, data: Biodata): Promise<OrderRow | null> {
  return getDb().transaction(async (tx) => {
    // Evaluate expiry only after waiting for any competing order mutation.
    const [locked] = await tx.select({ token: orders.token }).from(orders)
      .where(eq(orders.token, token)).for('update');
    if (!locked) return null;
    const [updated] = await tx.update(orders).set({
      biodata: data,
      templateSlug: data.templateSlug,
      docLocale: data.docLocale,
      editsUsed: sql`${orders.editsUsed} + 1`,
      pdfStatus: 'none',
      pdfPath: null
    }).where(and(
      eq(orders.token, token),
      eq(orders.status, 'paid'),
      isNull(orders.deletedAt),
      sql`${orders.expiresAt} > clock_timestamp()`,
      sql`${orders.editsUsed} < ${orders.editLimit}`,
      eq(orders.editsUsed, expectedRevision)
    )).returning();
    return updated ?? null;
  });
}
