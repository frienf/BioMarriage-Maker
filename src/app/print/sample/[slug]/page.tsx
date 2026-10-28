import { notFound } from 'next/navigation';
import type { DocLocale } from '@/lib/biodata';
import { DOC_LOCALES } from '@/lib/biodata';
import { templateBySlug } from '@/templates/catalog';
import { TemplateSheet } from '@/templates/render';
import { sampleFor } from '@/templates/sample';
import { frameDataUri } from '@/templates/chitra-art';
import { PrintReady } from '../../[token]/print-ready';

export const dynamic = 'force-dynamic';

/** `?photo=1`: a landscape test picture, so proofs show how a photo sits in
 *  each template's opening (it has to be cover-cropped into a portrait slot). */
const TEST_PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B6E8F"/><stop offset="1" stop-color="#C9784A"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="200" r="90" fill="#F4E9D8"/></svg>'
)}`;

/**
 * A template printed with fictional sample details, for proofing.
 *
 * This is how the print test sheet is produced: send it to a real inkjet and a
 * real laser and check the watermark actually appears and the border is not
 * clipped. Development only, because it hands out a clean, unpaid document.
 */
export default async function SamplePrintPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; accent?: string; photo?: string }>;
}) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { slug } = await params;
  const { lang, accent, photo } = await searchParams;
  const def = templateBySlug(slug);
  if (!def) notFound();

  const locale: DocLocale = (DOC_LOCALES as readonly string[]).includes(lang ?? '')
    ? (lang as DocLocale)
    : def.docLocales[0];
  const data = { ...sampleFor(def.slug, locale), templateSlug: def.slug };
  if (photo === '1') data.photo = { src: TEST_PHOTO, position: '50% 50%' };
  const pages: Array<1 | 2> = def.pages === 2 ? [1, 2] : [1];
  const ink = accent && /^[0-9a-fA-F]{6}$/.test(accent) ? `#${accent}` : def.accent;
  const frameSrc = def.layout === 'chitra' ? await frameDataUri(def.slug) : undefined;

  return (
    <>
      {pages.map((page) => (
        <div key={page} className="print-sheet">
          <TemplateSheet data={data} accent={ink} page={page} instanceId={`sample-${page}`} frameSrc={frameSrc} />
        </div>
      ))}
      <PrintReady />
    </>
  );
}
