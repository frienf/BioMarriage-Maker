import type { CSSProperties } from 'react';
import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { DEV_THEMES } from './devotional-themes';
import { CHITRA_FRAMES, slotSpacer } from './chitra-frames';

/**
 * The chitra collection: the owner's page design is the page, and only the
 * text and photo are laid over it. One component, one data row per frame.
 *
 * The text flows inside the article's padding, which is the frame's text box.
 * Anything that grows past the bottom of the box therefore raises the article's
 * scrollHeight above A4, which is exactly what the editor's warning, the review
 * page's payment block and `npm run fit` measure: none of them needed to change.
 */
export function ChitraTemplate({ data, slug, frameSrc }: { data: Biodata; slug: string; frameSrc?: string }) {
  const f = CHITRA_FRAMES[slug];
  if (!f) return null;
  const t = DEV_THEMES[f.motif];
  const l = labelsFor(data.docLocale);
  const built = buildSections(data);
  const s = f.slot;
  const spacer = slotSpacer(f);

  const photoBox: CSSProperties = {
    position: 'absolute',
    left: s.x,
    top: s.y,
    width: s.w,
    height: s.h,
    overflow: 'hidden',
    borderRadius: s.shape === 'oval' ? '50%' : s.radius,
    clipPath: s.shape === 'path' ? `path('${s.path}')` : undefined
  };

  return (
    <article
      lang={data.docLocale}
      style={{
        position: 'relative',
        width: 'var(--a4-w)',
        height: 'var(--a4-h)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: `${f.text.top}px ${f.text.right}px ${f.text.bottom}px ${f.text.left}px`,
        background: f.paper,
        color: f.ink,
        fontFamily: t.body,
        fontSize: f.size,
        lineHeight: 1.32
      }}
    >
      {/* Never loading="lazy": PrintReady waits for every image to decode, and a
          lazy one that never loads would hold the PDF render until it times out. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frameSrc ?? `/frames/${slug}.jpg`}
        alt=""
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />

      {data.photo?.src ? (
        <div data-chitra-photo="" style={photoBox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photo.src}
            alt={l.photoPlaceholder}
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: data.photo.position || '50% 30%' }}
          />
        </div>
      ) : null}

      {/* Positioned so it paints above the frame image, which is positioned too. */}
      <div style={{ position: 'relative' }}>
        {spacer ? <div aria-hidden="true" style={{ float: 'right', width: spacer.w, height: spacer.h }} /> : null}

        <header data-chitra-head="" style={{ textAlign: 'center', marginBottom: 10 }}>
          <p lang={t.invLang} style={{ margin: 0, fontFamily: t.invFont, fontSize: 13, color: f.accent }}>
            {t.invocation}
          </p>
          {/* Kicker and name, on a plate where the design drew a name bar: at its
              smallest the plate is that bar, and it grows if a long name wraps. */}
          <div
            data-chitra-plate={f.plate ? '' : undefined}
            style={
              f.plate
                ? { display: 'inline-block', minWidth: f.plate.w, minHeight: f.plate.h, maxWidth: '100%', boxSizing: 'border-box', padding: '0 12px', marginTop: 2, background: f.plate.fill }
                : undefined
            }
          >
            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600 }}>{built.kicker}</p>
            <h1 style={{ margin: 0, fontFamily: t.head, fontWeight: t.headWeight, fontSize: 28, lineHeight: 1.15, color: f.accent }}>
              {built.name}
            </h1>
          </div>
          {built.subtitle ? <p style={{ margin: '2px 0 0', fontSize: 14 }}>{built.subtitle}</p> : null}
        </header>

        <div data-chitra-body="" style={{ clear: 'both', columnCount: 2, columnGap: 24 }}>
          {built.sections.map((sec, i) => (
            <section key={i} style={{ marginBottom: 7 }}>
              <h2
                style={{
                  margin: '0 0 3px',
                  paddingBottom: 2,
                  borderBottom: `1px solid ${f.rule}`,
                  fontFamily: t.head,
                  fontWeight: t.headWeight,
                  fontSize: 16,
                  lineHeight: 1.25,
                  color: f.accent,
                  breakAfter: 'avoid'
                }}
              >
                {sec.title}
              </h2>
              {sec.text ? <p style={{ margin: 0, textWrap: 'pretty', overflowWrap: 'anywhere' }}>{sec.text}</p> : null}
              {sec.rows.map((r, j) => (
                <div
                  key={j}
                  style={{ display: 'grid', gridTemplateColumns: '40% 8px minmax(0, 1fr)', columnGap: 4, alignItems: 'baseline', breakInside: 'avoid' }}
                >
                  <span style={{ color: f.accent }}>{r.l}</span>
                  <span aria-hidden="true" style={{ color: f.accent }}>
                    :
                  </span>
                  <span data-chitra-value="" style={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
                    {r.v}
                  </span>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
