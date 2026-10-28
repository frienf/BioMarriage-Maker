import type { Biodata } from '@/lib/biodata';
import { templateBySlug, type TemplateDef } from './catalog';
import { DevotionalTemplate } from './devotional';
import { KumkumTemplate } from './kumkum';
import { AkashTemplate } from './akash';
import { SaralTemplate } from './saral';
import { MayurTemplate } from './mayur';
import { ParamparikTemplate } from './paramparik';
import { ChitraTemplate } from './chitra';
import { ArtworkTemplate } from './artwork';
import type { Manifest } from './schema';

/** A4 in CSS pixels at 96dpi. Matches --a4-w / --a4-h. */
export const A4 = { w: 794, h: 1123 } as const;

/** One switch from slug to component. Everything that shows a biodata goes
 *  through here: gallery, detail, editor preview and the PDF. */
export function TemplateSheet({
  data,
  accent,
  page = 1,
  instanceId = 'x',
  frameSrc,
  manifest
}: {
  data: Biodata;
  accent?: string;
  page?: 1 | 2;
  instanceId?: string;
  /** A chitra frame's print copy as a data URI; only the print pages pass it. */
  frameSrc?: string;
  /** Manifest for artwork layouts. */
  manifest?: Manifest;
}) {
  const def: TemplateDef | undefined = templateBySlug(data.templateSlug);
  if (!def) return null;
  const ink = accent ?? def.accent;

  switch (def.layout) {
    case 'devotional':
      return <DevotionalTemplate data={data} motif={def.motif ?? 'ganesh'} page={page} />;
    case 'kumkum':
      return <KumkumTemplate data={data} accent={ink} />;
    case 'akash':
      return <AkashTemplate data={data} accent={ink} />;
    case 'saral':
      return <SaralTemplate data={data} accent={ink} />;
    case 'mayur':
      return <MayurTemplate data={data} accent={ink} />;
    case 'paramparik':
      return <ParamparikTemplate data={data} accent={ink} instanceId={instanceId} />;
    case 'chitra':
      return <ChitraTemplate data={data} slug={def.slug} frameSrc={frameSrc} />;
    case 'artwork':
      return <ArtworkTemplate data={data} manifestId={def.manifestId!} manifest={manifest} accent={ink} />;
  }
}

/**
 * Shows a sheet at a chosen width by scaling the A4 box, never by reflowing it.
 * `watermark` stamps an unpaid preview; it is cosmetic, and the real guard is
 * that an unpaid download is refused server-side.
 */
export function ScaledSheet({
  width,
  children,
  watermark,
  shadow,
  label
}: {
  width: number;
  children: React.ReactNode;
  watermark?: string;
  shadow?: boolean;
  label?: string;
}) {
  const scale = width / A4.w;
  return (
    <div
      className={`sheet-frame${shadow ? ' sheet-shadow' : ''}`}
      style={{ width, height: Math.round(A4.h * scale) }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <div className="sheet-scale" style={{ '--sheet-scale': scale } as React.CSSProperties} aria-hidden={label ? true : undefined}>
        {children}
      </div>
      {watermark ? (
        <div aria-hidden="true" className="sheet-watermark">
          <span>{watermark}</span>
        </div>
      ) : null}
    </div>
  );
}
