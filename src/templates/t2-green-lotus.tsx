import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE, PortraitPhoto } from './base-parts';

/** T2 — Green lotus (full decorative background, circle photo, deity figure, left lotus strip).
 *  Source: Design Template/image_404a553f.jpg (864x1232, ratio 0.7013 — A4 pass within 1%).
 *  Art = single flattened raster; photo/content = code only.
 */
export function T2Template({ data, accent = '#145250' }: { data: Biodata; accent?: string }) {
  const l = labelsFor(data.docLocale);
  const b = buildSections(data);
  // Measured positions: photo circle (549,101,723,273) w174 h173; Lakshmi figure (332,64,495,228);
  // content full-width from y27 to y1089; left content must clear lotus strip (~sheet x270 => left margin ~220-240); bottom at gold line ~y1089.
  const photoSlot = { left: 549, top: 101, width: 174, height: 173, shape: 'circle' as const };

  return (
    <article lang={data.docLocale} style={{ ...PAGE, position: 'relative', overflow: 'hidden', background: '#F5F0E4', color: '#2A3028', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontSize: 14, lineHeight: 1.36 }}>
      {/* Background decorative art */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Design Template/image_404a553f.jpg" alt="" aria-hidden="true" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', display: 'block' }} />

      {/* Photo mask: circle opening at drawn frame */}
      {data.photo?.src ? (
        <div data-t2-photo style={{ position: 'absolute', left: photoSlot.left, top: photoSlot.top, width: photoSlot.width, height: photoSlot.height, overflow: 'hidden', borderRadius: '50%', border: '3px solid #C5A561', boxShadow: 'inset 0 0 0 2px #F5F0E4' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.photo.src} alt={l.photoPlaceholder} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: data.photo.position || '50% 30%', display: 'block' }} />
        </div>
      ) : (
        <div data-t2-photo-placeholder style={{ position: 'absolute', left: photoSlot.left, top: photoSlot.top, width: photoSlot.width, height: photoSlot.height, borderRadius: '50%', border: '2px dashed #C5A561', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#8A7A5B' }}>Photo</div>
      )}

      {/* Deity figure exclusion zone (top-center) — content avoids this horizontally; content starts lower vertically */}
      {/* Content area: full-width from y27; left content must stay right of lotus strip (~x270 sheet => min content left x230) */}
      <div style={{ position: 'relative', padding: '36px 50px 36px 240px' }}>
        <header style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{ margin: '0 0 4px', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontWeight: 400, fontSize: 28, lineHeight: 1.15, color: '#145250' }}>{b.name}</h1>
          {b.subtitle ? <p style={{ margin: 0, fontSize: 13, color: '#5A7868' }}>{b.subtitle}</p> : null}
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          {b.personal.rows.length ? (
            <section>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#145250', borderBottom: '1px solid #C5A561', paddingBottom: 4 }}>{b.personal.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '130px minmax(0,1fr)', gap: '2px 14px', fontSize: 13 }}>
                {b.personal.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: '#6B7A58' }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {b.about.text ? (
            <section style={{ borderTop: '1px solid #C5A561', paddingTop: 12 }}>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#145250' }}>{b.about.title}</h2>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.42, textWrap: 'pretty' }}>{b.about.text}</p>
            </section>
          ) : null}
          {b.contact.rows.length ? (
            <section style={{ borderTop: '1px solid #C5A561', paddingTop: 12 }}>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#145250' }}>{b.contact.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '130px minmax(0,1fr)', gap: '2px 14px', fontSize: 13 }}>
                {b.contact.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: '#6B7A58' }}>{r.l}</dt>
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
