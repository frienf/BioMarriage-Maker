import { notFound } from 'next/navigation';
import { biodataSchema } from '@/lib/biodata';
import { orderByToken } from '@/lib/orders';
import { templateBySlug } from '@/templates/catalog';
import { TemplateSheet } from '@/templates/render';
import fs from 'node:fs';
import path from 'node:path';
import type { Manifest } from '@/templates/schema';
import { frameDataUri } from '@/templates/chitra-art';
import { PrintReady } from './print-ready';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Only a paid, unerased order renders here. Holding the token is the
 * authorisation, and an unpaid token must not produce a clean document.
 */
export default async function PrintPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await orderByToken(token);
  if (!order || order.status !== 'paid' || order.deletedAt || !order.biodata) notFound();

  const parsed = biodataSchema.safeParse(order.biodata);
  if (!parsed.success) notFound();
  const data = parsed.data;
  const def = templateBySlug(data.templateSlug);
  if (!def) notFound();

  const pages: Array<1 | 2> = def.pages === 2 ? [1, 2] : [1];
  const frameSrc = def.layout === 'chitra' ? await frameDataUri(def.slug) : undefined;
  let manifest: Manifest | undefined = undefined;
  if (def.layout === 'artwork' && def.manifestId) {
    const mp = path.join(process.cwd(), 'public', 'templates', def.manifestId, 'manifest.json');
    manifest = JSON.parse(fs.readFileSync(mp, 'utf8'));
  }

  return (
    <>
      {pages.map((page) => (
        <div key={page} className="print-sheet">
          <TemplateSheet data={data} accent={order.accent ?? def.accent} page={page} instanceId={`print-${page}`} frameSrc={frameSrc} manifest={manifest} />
        </div>
      ))}
      <PrintReady />
    </>
  );
}
