export type PdfDownloadDeps = {
  render(): Promise<Uint8Array>;
  authorize(revision: number): Promise<boolean>;
};

/** Never allow persisted untrusted URLs to be loaded by the PDF browser. */
export async function printableBiodata(value: unknown) {
  const parsed = biodataSchema.safeParse(value);
  return parsed.success && await validPhoto(parsed.data.photo.src) ? parsed.data : null;
}

// Shared across module reloads in this process; not shared across processes.
const processState = globalThis as typeof globalThis & { __pdfRenderTokens?: Set<string> };
const activeRenders = processState.__pdfRenderTokens ??= new Set<string>();
const MAX_RENDERERS = 4;

export function renderBusyResponse(): Response {
  return Response.json({ error: 'PDF rendering is busy. Please retry shortly.' }, {
    status: 429, headers: { 'Retry-After': '5', 'Cache-Control': 'private, no-store' }
  });
}

export async function withRenderSlot<T>(token: string, work: () => Promise<T>): Promise<
  { kind: 'busy' } | { kind: 'ok'; value: T }
> {
  if (activeRenders.size >= MAX_RENDERERS || activeRenders.has(token)) return { kind: 'busy' };
  activeRenders.add(token);
  try {
    return { kind: 'ok', value: await work() };
  } finally {
    activeRenders.delete(token);
  }
}

export function printableRevision(
  order: { status: string; deletedAt: Date | null; expiresAt: Date | null; editsUsed: number },
  revision: unknown,
  now = new Date()
): boolean {
  return typeof revision === 'string' && /^(0|[1-9]\d*)$/.test(revision) &&
    revision === String(order.editsUsed) && order.status === 'paid' && !order.deletedAt &&
    !!order.expiresAt && order.expiresAt > now;
}

/** Authorization and allowance consumption happen only after rendering succeeds. */
export async function authorizedPdf(revision: number, deps: PdfDownloadDeps): Promise<Uint8Array | null> {
  const rendered = await deps.render();
  return await deps.authorize(revision) ? rendered : null;
}

export function guardedAuthorizedPdf(token: string, revision: number, deps: PdfDownloadDeps) {
  return withRenderSlot(token, () => authorizedPdf(revision, deps));
}
import { biodataSchema } from './biodata.ts';
import { validPhoto } from './photo-validation.ts';
