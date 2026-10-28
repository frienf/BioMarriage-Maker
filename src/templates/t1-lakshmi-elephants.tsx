import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE, PortraitPhoto } from './base-parts';

/** T1 — Lakshmi with elephants (full decorative background, circle photo slot).
 *  Source: Design Template/image_146c7743.jpg (896x1200, ratio 0.7467 — must be
 *  regenerated at exact A4 0.707 ±1% with width ≥1588 before final verify).
 *  Art = single flattened raster; photo/content = code only. No SVG redraw.
 */
export function T1Template({ data, accent = '#7A3B1C' }: { data: Biodata; accent?: string }) {
  const l = labelsFor(data.docLocale);
  const b = buildSections(data);

  // Measured sheet positions (from image pixel analysis, estimated where art is decorative):
  // Photo slot: circle opening at sheet (502,158) w152 h168 (top-right ornate frame)
  // Deity panel exclusion: top-left (124,122) to (443,290) — includes Lakshmi + elephants + platform
  // Content body: below header (~y197) to above bottom decorative band (~y872); split left/right to clear both exclusions
  const photoSlot = { left: 502, top: 158, width: 152, height: 168, shape: 'circle' as const };
  const bodyLeft = 97, bodyTop = 197, bodyRight = 697, bodyBottom = 872;

  return (
    <article lang={data.docLocale} style={{ ...PAGE, position: 'relative', overflow: 'hidden', background: '#EFE8D8', color: '#3A2418', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontSize: 14, lineHeight: 1.36 }}>
      {/* Background art: full-page decorative raster */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Design Template/image_146c7743.jpg"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', display: 'block' }}
      />

      {/* Photo mask: exactly sits on the drawn circular opening */}
      {data.photo?.src ? (
        <div
          data-t1-photo
          style={{
            position: 'absolute',
            left: photoSlot.left,
            top: photoSlot.top,
            width: photoSlot.width,
            height: photoSlot.height,
            overflow: 'hidden',
            borderRadius: photoSlot.shape === 'circle' ? '50%' : undefined,
            boxShadow: 'inset 0 0 0 2px #C5A561', // faint gold inner ring matching drawn frame
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photo.src}
            alt={l.photoPlaceholder}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: data.photo.position || '50% 30%', display: 'block' }}
          />
        </div>
      ) : (
        <div
          data-t1-photo-placeholder
          style={{
            position: 'absolute',
            left: photoSlot.left,
            top: photoSlot.top,
            width: photoSlot.width,
            height: photoSlot.height,
            borderRadius: '50%',
            border: '2px dashed #C5A561',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            color: '#8A6D4B',
          }}
        >
          Photo
        </div>
      )}

      {/* Content body: split layout to avoid top-left deity panel and top-right photo */}
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', padding: `${bodyTop}px ${bodyLeft}px ${PAGE.height - bodyBottom}px` }}>
        {/* Left column — sections that don't overlap the photo slot horizontally */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <header style={{ textAlign: 'center', marginBottom: 4 }}>
            <h1 style={{ margin: '0 0 4px', fontFamily: 'Georgia, "Noto Serif Devanagari", serif', fontWeight: 400, fontSize: 26, lineHeight: 1.2, color: accent }}>{b.name}</h1>
            {b.subtitle ? <p style={{ margin: 0, fontSize: 13, color: '#6B4E3A' }}>{b.subtitle}</p> : null}
          </header>
          {b.personal.rows.length ? (
            <section>
              <h2 style={{ margin: '0 0 4px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 15, color: '#6B4E3A' }}>{b.personal.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', gap: '0px 10px', fontSize: 12.5 }}>
                {b.personal.rows.map((r, i) => (
                  <div key={i} style={{ display: 'contents' }}>
                    <dt style={{ color: '#A07A4E', fontSize: 11 }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {b.about.text ? (
            <section style={{ borderTop: '1px solid #D8C8A8', paddingTop: 10 }}>
              <h2 style={{ margin: '0 0 4px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 15, color: '#6B4E3A' }}>{b.about.title}</h2>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.42, textWrap: 'pretty' }}>{b.about.text}</p>
            </section>
          ) : null}
          {b.contact.rows.length ? (
            <section style={{ borderTop: '1px solid #D8C8A8', paddingTop: 10 }}>
              <h2 style={{ margin: '0 0 4px', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 15, color: '#6B4E3A' }}>{b.contact.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', gap: '0px 10px', fontSize: 12.5 }}>
                {b.contact.rows.map((r, i) => (
                  <div key={i} style={{ display: 'contents' }}>
                    <dt style={{ color: '#A07A4E', fontSize: 11 }}>{r.l}</dt>
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
