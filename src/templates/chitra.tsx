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
  const built = buildSections(
    data,
    (slug === 'vaibhav-lakshmi' || slug === 'jagannath-mandir' || slug === 'aditya' || slug === 'shankha-mandala' || slug === 'annapurna' || slug === 'kamadeva' || slug === 'balaji-namam' || slug === 'sheshashayi' || slug === 'parvati' || slug === 'lakshmi-padma-cream' || slug === 'jagannath-soft') &&
      data.docLocale === 'mr'
      ? 'devanagari'
      : 'latin'
  );
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
        lineHeight: slug === 'aditya' ? 1.24 : slug === 'shankha-mandala' ? 1.2 : slug === 'annapurna' ? 1.18 : slug === 'kamadeva' ? 1.18 : slug === 'balaji-namam' ? 1.18 : slug === 'jagannath-dark' ? 1.18 : slug === 'sheshashayi' ? 1.18 : slug === 'jagannath-soft' ? 1.15 : slug === 'lakshmi-padma-cream' ? 1.15 : 1.32
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

        <header data-chitra-head="" style={{ textAlign: f.headerAlign ?? 'center', marginBottom: slug === 'shankha-mandala' ? 6 : slug === 'annapurna' ? 6 : slug === 'kamadeva' ? 6 : slug === 'lakshmi-padma-cream' ? 6 : slug === 'jagannath-soft' ? 6 : 10, display: f.containHeader ? 'flow-root' : undefined }}>
          <p lang={t.invLang} style={{ margin: 0, fontFamily: t.invFont, fontSize: 13, color: f.accent }}>
            {t.invocation}
          </p>
          {/* Kicker and name, on a plate where the design drew a name bar: at its
              smallest the plate is that bar, and it grows if a long name wraps. */}
          <div
            data-chitra-plate={f.plate ? '' : undefined}
            style={
              f.plate
                ? {
                    display: 'inline-block',
                    minWidth: f.plate.w,
                    minHeight: f.plate.h,
                    maxWidth: f.headerMaxWidth ?? '100%',
                    boxSizing: 'border-box',
                    padding: '0 12px',
                    marginTop: 2,
                    background: f.plate.fill
                  }
                : f.headerMaxWidth
                ? { maxWidth: f.headerMaxWidth }
                : undefined
            }
          >
            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600 }}>{built.kicker}</p>
            <h1 style={{ margin: 0, fontFamily: t.head, fontWeight: t.headWeight, fontSize: (slug === 'simha' || slug === 'aditya' || slug === 'annapurna' || slug === 'kamadeva' || slug === 'balaji-namam' || slug === 'sheshashayi' || slug === 'lakshmi-padma-cream' || slug === 'jagannath-soft') ? 26 : slug === 'shankha-mandala' ? 22 : 28, lineHeight: (slug === 'simha' || slug === 'aditya' || slug === 'annapurna' || slug === 'kamadeva' || slug === 'balaji-namam' || slug === 'sheshashayi' || slug === 'lakshmi-padma-cream' || slug === 'jagannath-soft') ? 1.1 : slug === 'shankha-mandala' ? 1.05 : 1.15, color: f.accent }}>
              {built.name}
            </h1>
          </div>
          {built.subtitle ? <p style={{ margin: '2px 0 0', fontSize: slug === 'shankha-mandala' ? 13 : 14 }}>{built.subtitle}</p> : null}
        </header>

        <div data-chitra-body="" style={{ clear: 'both', columnCount: 2, columnGap: slug === 'lakshmi-padma-cream' ? 16 : slug === 'shankha-mandala' ? 20 : slug === 'jagannath-soft' ? 20 : 24 }}>
          {built.sections.map((sec, i) => (
            <section key={i} style={{ marginBottom: slug === 'simha' ? 9 : slug === 'aditya' ? 5 : slug === 'shankha-mandala' ? 2 : slug === 'lakshmi-padma-cream' ? 2 : slug === 'annapurna' ? 3 : slug === 'kamadeva' ? 3 : slug === 'balaji-namam' ? 3 : slug === 'jagannath-dark' ? 3 : slug === 'sheshashayi' ? 3 : slug === 'jagannath-soft' ? 3 : 7 }}>
              <h2
                style={{
                  margin: slug === 'shankha-mandala' || slug === 'lakshmi-padma-cream' ? '0 0 2px' : '0 0 3px',
                  paddingBottom: slug === 'shankha-mandala' || slug === 'lakshmi-padma-cream' ? 1 : 2,
                  borderBottom: `1px solid ${f.rule}`,
                  fontFamily: t.head,
                  fontWeight: t.headWeight,
                  fontSize: slug === 'shankha-mandala' || slug === 'lakshmi-padma-cream' ? 14 : 16,
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
