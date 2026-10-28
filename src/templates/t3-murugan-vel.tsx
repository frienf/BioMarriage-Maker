import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE, PortraitPhoto } from './base-parts';

/** T3 — Murugan with vel (full decorative parchment, rectangular photo opening).
 *  Source: Design Template/image_9372ce8f.jpg (896x1200, ratio 0.7467 — must be
 *  regenerated at exact A4 0.707 ±1% with width ≥1588 before final verify).
 *  Art = single flattened raster. No SVG redraw of deity/panel/border.
 */
export function T3Template({ data, accent = '#8A5A30' }: { data: Biodata; accent?: string }) {
  const l = labelsFor(data.docLocale);
  const b = buildSections(data);
  // Measured: photo rect opening (543,136,678,333) w135 h197; deity panel (350,60,520,310);
  // inner frame: top border y3, bottom feathers near source y1095 => sheet y1024; body trimmed y1065.
  const photoSlot = { left: 543, top: 136, width: 135, height: 197, shape: 'rect' as const };
  const bodyTop = 340; // below top deity panel (bottom y310 + gap)
  const bodyBottom = 1065; // above bottom feather border (~y1024 sheet, trimmed)

  return (
    <article lang={data.docLocale} style={{ ...PAGE, position: 'relative', overflow: 'hidden', background: '#F0E6CC', color: '#3A2416', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontSize: 14, lineHeight: 1.36 }}>
      {/* Decorative parchment background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Design Template/image_9372ce8f.jpg" alt="" aria-hidden="true" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', display: 'block' }} />

      {/* Photo mask: rectangular opening (drawn wood-texture frame) */}
      <PortraitPhoto data={data} alt={l.photoPlaceholder} width={photoSlot.width} height={photoSlot.height} tint="#F3E4D0" silhouette="#DCC8B2" style={{ position: 'absolute', left: photoSlot.left, top: photoSlot.top, border: '2px solid #C2963F', boxShadow: 'inset 0 0 0 1px #F0E6CC', overflow: 'hidden' }} />

      {/* Content within inner decorative frame (clear deity panel and photo) */}
      <div style={{ position: 'relative', padding: `${bodyTop}px 70px ${1123 - bodyBottom}px` }}>
        <header style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{ margin: '0 0 5px', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontWeight: 400, fontSize: 26, lineHeight: 1.2, color: accent }}>{b.name}</h1>
          {b.subtitle ? <p style={{ margin: 0, fontSize: 13, color: accent }}>{b.subtitle}</p> : null}
          <div aria-hidden="true" style={{ width: 80, height: 2, background: '#C2963F', margin: '8px auto 0' }} />
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620, margin: '0 auto' }}>
          {b.personal.rows.length ? (
            <section>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: 3 }}>{b.personal.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '130px minmax(0,1fr)', gap: '2px 14px', fontSize: 13 }}>
                {b.personal.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: '#9B6A3E' }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {b.about.text ? (
            <section style={{ borderTop: '1px solid #D8B88A', paddingTop: 14 }}>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#5A2A10' }}>{b.about.title}</h2>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.44, textWrap: 'pretty' }}>{b.about.text}</p>
            </section>
          ) : null}
          {b.contact.rows.length ? (
            <section style={{ borderTop: '1px solid #D8B88A', paddingTop: 14 }}>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#5A2A10' }}>{b.contact.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '110px minmax(0,1fr)', gap: '2px 14px', fontSize: 12.5 }}>
                {b.contact.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: '#9B6A3E' }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
