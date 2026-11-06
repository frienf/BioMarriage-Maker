import { notFound } from 'next/navigation';
import { orderByToken } from '@/lib/orders';
import { printableBiodata, printableRevision } from '@/lib/pdf-download';
import { templateBySlug } from '@/templates/catalog';
import { TemplateSheet } from '@/templates/render';
import { frameDataUri } from '@/templates/chitra-art';
import { PrintReady } from './print-ready';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Only a paid, unerased order renders here. Holding the token is the
 * authorisation, and an unpaid token must not produce a clean document.
 */
export default async function PrintPage({ params, searchParams }: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ revision?: string | string[] }>;
}) {
  const { token } = await params;
  const order = await orderByToken(token);
  const { revision = '0' } = await searchParams;
  if (!order || !printableRevision(order, revision) || !order.biodata) notFound();

  const data = await printableBiodata(order.biodata);
  if (!data) notFound();
  const def = templateBySlug(data.templateSlug);
  if (!def) notFound();

  const pages: Array<1 | 2> = def.pages === 2 ? [1, 2] : [1];
  const frameSrc = def.layout === 'chitra' ? await frameDataUri(def.slug) : undefined;

  return (
    <>
      {pages.map((page) => (
        <div key={page} className="print-sheet">
          <TemplateSheet data={data} accent={order.accent ?? def.accent} page={page} instanceId={`print-${page}`} frameSrc={frameSrc} />
        </div>
      ))}
      <PrintReady />
    </>
  );
}
