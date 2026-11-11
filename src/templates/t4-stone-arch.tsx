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
  // Remeasured visual: carved niche/deity panel (90,65,460,330); inner arch opening.
  // Body starts below that top artwork; excludes left border art (~x74) and arch slot.
  const photoSlot = { left: 514, top: 126, width: 157, height: 245, shape: 'arch' as const };
  const bodyTop = 438, bodyBottom = 1000;

  // Arch clip path matching the drawn stone opening.
  const archClip = 'path("M 0 245 L 0 65 Q 6 40 20 38 Q 24 20 40 21 Q 49 7 63 10 Q 78 -5 93 10 Q 108 7 117 21 Q 133 20 137 38 Q 151 40 157 65 L 157 245 Z")';

  return (
    <article lang={data.docLocale} style={{ ...PAGE, position: 'relative', overflow: 'hidden', background: '#EAE0C8', color: '#3A2A1C', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontSize: 14, lineHeight: 1.36 }}>
      {/* Full decorative stone-art background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Design Template/image_30039c0.jpg" alt="" aria-hidden="true" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', display: 'block' }} />

      {/* Photo mask: arched opening */}
      <PortraitPhoto data={data} alt={l.photoPlaceholder} width={photoSlot.width} height={photoSlot.height} tint="#F3E4D0" silhouette="#DCC8B2" style={{ position: 'absolute', left: photoSlot.left, top: photoSlot.top, border: '2px solid #C2963F', borderRadius: '6px 6px 0 0', clipPath: archClip, overflow: 'hidden' }} />

      {/* Content body (excludes left decorative border and arch slot; below top decorative band) */}
      <div style={{ position: 'relative', padding: `${bodyTop}px 50px ${1123 - bodyBottom}px 110px` }}>
        <header style={{ textAlign: 'center', marginBottom: 18 }}>
          <h1 style={{ margin: '0 0 5px', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontWeight: 400, fontSize: 26, lineHeight: 1.2, color: accent }}>{b.name}</h1>
          {b.subtitle ? <p style={{ margin: 0, fontSize: 13, color: '#7A5C3E' }}>{b.subtitle}</p> : null}
          <div aria-hidden="true" style={{ width: 60, height: 2, background: '#C2963F', margin: '8px auto 0' }} />
        </header>
        <div style={{ columnCount: 2, columnGap: 24, maxWidth: 580 }}>
          {b.sections.map((sec) => (
            <section key={sec.title} style={{ marginBottom: 8 }}>
              <h2 style={{ margin: '0 0 3px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 16, color: '#5A3A2B', borderBottom: '1px solid #D8B88A', paddingBottom: 2, breakAfter: 'avoid' }}>{sec.title}</h2>
              {sec.text ? <p style={{ margin: 0, fontSize: 13, textWrap: 'pretty', overflowWrap: 'anywhere' }}>{sec.text}</p> : null}
              {sec.rows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40% minmax(0, 1fr)', gap: 8, fontSize: 13, breakInside: 'avoid' }}>
                  <span style={{ color: '#754523' }}>{r.l}</span>
                  <span style={{ overflowWrap: 'anywhere' }}>{r.v}</span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
