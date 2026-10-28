import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE, PortraitPhoto } from './base-parts';

/** T4 — Stone arch (carved stone decorative border, arched photo opening, deity niche).
 *  Source: Design Template/image_30039c0.jpg (864x1232, ratio 0.7013 — A4 pass within 1%).
 *  Art = single flattened JPG; no SVG redraw.
 */
export function T4Template({ data, accent = '#5A3A2B' }: { data: Biodata; accent?: string }) {
  const l = labelsFor(data.docLocale);
  const b = buildSections(data);
  // Measured: arch slot (512,127,671,373) w159 h246; carved niche/deity panel (90,65,460,330).
  // Body starts below decorative top border (~y150); excludes left border art (~x74) and arch slot.
  const photoSlot = { left: 512, top: 127, width: 159, height: 246, shape: 'arch' as const };
  const bodyTop = 150, bodyBottom = 980;

  // Arch clip path matching the drawn stone opening (simplified arch curve)
  const archClip = 'path("M 0 246 L 0 60 Q 79 10 159 60 L 159 246 Z")';

  return (
    <article lang={data.docLocale} style={{ ...PAGE, position: 'relative', overflow: 'hidden', background: '#EAE0C8', color: '#3A2A1C', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontSize: 14, lineHeight: 1.36 }}>
      {/* Full decorative stone-art background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Design Template/image_30039c0.jpg" alt="" aria-hidden="true" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', display: 'block' }} />

      {/* Photo mask: arched opening */}
      {data.photo?.src ? (
        <div data-t4-photo style={{ position: 'absolute', left: photoSlot.left, top: photoSlot.top, width: photoSlot.width, height: photoSlot.height, overflow: 'hidden', clipPath: archClip as any, border: '2px solid #C2963F', borderRadius: '6px 6px 0 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.photo.src} alt={l.photoPlaceholder} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: data.photo.position || '50% 30%', display: 'block' }} />
        </div>
      ) : (
        <div data-t4-photo-placeholder style={{ position: 'absolute', left: photoSlot.left, top: photoSlot.top, width: photoSlot.width, height: photoSlot.height, clipPath: archClip as any, border: '2px dashed #C2963F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#8A6D4B' }}>Photo</div>
      )}

      {/* Content body (excludes left decorative border and arch slot; below top decorative band) */}
      <div style={{ position: 'relative', padding: `${bodyTop}px 50px 36px 110px` }}>
        <header style={{ textAlign: 'center', marginBottom: 18 }}>
          <h1 style={{ margin: '0 0 5px', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontWeight: 400, fontSize: 26, lineHeight: 1.2, color: '#5A3A2B' }}>{b.name}</h1>
          {b.subtitle ? <p style={{ margin: 0, fontSize: 13, color: '#7A5C3E' }}>{b.subtitle}</p> : null}
          <div aria-hidden="true" style={{ width: 60, height: 2, background: '#C2963F', margin: '8px auto 0' }} />
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 580 }}>
          {b.personal.rows.length ? (
            <section>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#5A3A2B', borderBottom: '1px solid #D8B88A', paddingBottom: 3 }}>{b.personal.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '120px minmax(0,1fr)', gap: '2px 14px', fontSize: 13 }}>
                {b.personal.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: '#9B6A3E' }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {b.education.rows.length ? (
            <section style={{ borderTop: '1px solid #D8B88A', paddingTop: 12 }}>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#5A3A2B' }}>{b.education.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '120px minmax(0,1fr)', gap: '2px 14px', fontSize: 13 }}>
                {b.education.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: '#9B6A3E' }}>{r.l}</dt><dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {b.about.text ? (
            <section style={{ borderTop: '1px solid #D8B88A', paddingTop: 12 }}>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#5A3A2B' }}>{b.about.title}</h2>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.44, textWrap: 'pretty' }}>{b.about.text}</p>
            </section>
          ) : null}
          {b.contact.rows.length ? (
            <section style={{ borderTop: '1px solid #D8B88A', paddingTop: 12 }}>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#5A3A2B' }}>{b.contact.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '100px minmax(0,1fr)', gap: '2px 14px', fontSize: 12.5 }}>
                {b.contact.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: '#9B6A3E' }}>{r.l}</dt><dd style={{ margin: 0 }}>{r.v}</dd>
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
