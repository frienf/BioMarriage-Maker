import type { CSSProperties } from 'react';
import type { Biodata } from '@/lib/biodata';
import { buildSections, type Row, type Section } from './rows';
import { labelsFor } from './labels';
import { DEV_THEMES, type DevTheme } from './devotional-themes';
import { FRAME, tileCenters } from './devotional-frame';
import { DeityBand, DeityLogo, DeityTile, Rosette, type Motif } from './ornaments';

/**
 * The devotional collection: one component, eight deities, three layouts.
 *
 * A4 is fixed at 794 x 1123 so the editor preview, the gallery thumbnail and
 * the printed PDF are the same pixels at different scales.
 */

const ROW_COLS = {
  classic: '200px 12px minmax(0, 1fr)',
  centered: '168px 12px minmax(0, 1fr)',
  split: '120px 12px minmax(0, 1fr)'
} as const;

function Rows({ rows, t, cols }: { rows: Row[]; t: DevTheme; cols: string }) {
  return (
    <>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{ display: 'grid', gridTemplateColumns: cols, columnGap: 10, alignItems: 'baseline' }}
        >
          <span style={{ color: t.label }}>{r.l}</span>
          <span aria-hidden="true" style={{ color: t.label }}>
            :
          </span>
          <span style={{ fontWeight: 500 }}>{r.v}</span>
        </div>
      ))}
    </>
  );
}

function Photo({
  t,
  data,
  width,
  height,
  round,
  alt
}: {
  t: DevTheme;
  data: Biodata;
  width: number | string;
  height: number;
  round?: boolean;
  alt: string;
}) {
  const frame: CSSProperties = {
    width,
    height,
    boxSizing: 'border-box',
    border: `3px solid ${t.accent2}`,
    padding: 4,
    background: '#FFFFFF',
    borderRadius: round ? 999 : 0,
    flex: 'none'
  };
  const inner: CSSProperties = {
    width: '100%',
    height: '100%',
    background: t.tint,
    borderRadius: round ? 999 : 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden'
  };
  return (
    <figure style={{ margin: 0, ...frame }}>
      <div style={inner}>
        {data.photo?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photo.src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: data.photo.position || '50% 30%' }}
          />
        ) : (
          <svg aria-hidden="true" width="70%" viewBox="0 0 120 150">
            <circle cx="60" cy="56" r="28" fill={t.accent2} fillOpacity="0.35" />
            <path d="M8 150 C 14 104, 36 92, 60 92 C 84 92, 106 104, 112 150 Z" fill={t.accent2} fillOpacity="0.35" />
          </svg>
        )}
      </div>
    </figure>
  );
}

function Heading({ t, children, ruled }: { t: DevTheme; children: React.ReactNode; ruled?: boolean }) {
  const base: CSSProperties = {
    margin: '0 0 1px',
    fontFamily: t.head,
    fontWeight: t.headWeight,
    fontSize: 20,
    lineHeight: 1.2,
    color: t.accent
  };
  if (ruled) {
    return (
      <h2 style={{ ...base, display: 'flex', alignItems: 'center', gap: 10, fontSize: 16 }}>
        <span aria-hidden="true" style={{ flex: 1, height: 1, background: t.accent2 }} />
        {children}
        <span aria-hidden="true" style={{ flex: 1, height: 1, background: t.accent2 }} />
      </h2>
    );
  }
  return <h2 style={base}>{children}</h2>;
}

function Block({ sec, t, cols, ruled }: { sec: Section; t: DevTheme; cols: string; ruled?: boolean }) {
  if (!sec.rows.length && !sec.text) return null;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Heading t={t} ruled={ruled}>
        {sec.title}
      </Heading>
      {sec.text ? <p style={{ margin: 0, textWrap: 'pretty', maxWidth: '36em' }}>{sec.text}</p> : null}
      <Rows rows={sec.rows} t={t} cols={cols} />
    </section>
  );
}

/**
 * The frame, as one SVG over the whole sheet, drawn bottom to top: the tiled
 * watermark, the rules, the two motif side bands and the corner rosettes.
 * Every repeat is a plain element, never an SVG <pattern>: Chromium prints a
 * pattern fill as a low-resolution bitmap, and `npm run proofs` fails if one
 * reaches a devotional PDF. Bands and rosettes stay outside the text box
 * (FRAME.padX), and the top rules break for the figure.
 */
// Computed once: the same 59 positions on every sheet.
const TILES = tileCenters();

function Frame({ t, motif }: { t: DevTheme; motif: Motif }) {
  const W = 794;
  const H = 1123;
  const o = FRAME.outer;
  const d = FRAME.band;
  const i = FRAME.inner;
  const run = H - 2 * o - 2 * d;
  const tl = FRAME.tile;
  const unit = 2 * FRAME.bandUnit;
  const units = Array.from({ length: Math.ceil(run / unit) }, (_, k) => k * unit);
  const band = (
    <svg width={d} height={run} overflow="hidden">
      {units.map((y) => (
        <g key={y} transform={`translate(0 ${y})`}>
          <DeityBand motif={motif} c={t.accent} c2={t.accent2} />
        </g>
      ))}
    </svg>
  );
  const gapL = (W - FRAME.figure.w) / 2 - 10;
  const gapR = W - gapL;
  const corners = [
    [o + d / 2, o + d / 2],
    [W - o - d / 2, o + d / 2],
    [o + d / 2, H - o - d / 2],
    [W - o - d / 2, H - o - d / 2]
  ];
  return (
    <svg aria-hidden="true" width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <g opacity={t.tileOpacity}>
        {TILES.map(({ x, y }) => (
          <g key={`${x}-${y}`} transform={`translate(${x - tl.size / 2} ${y - tl.size / 2})`}>
            <DeityTile motif={motif} c={t.accent} c2={t.accent2} />
          </g>
        ))}
      </g>
      <g fill="none">
        <path d={`M${gapL} ${o} H${o} V${H - o} H${W - o} V${o} H${gapR}`} stroke={t.accent} strokeWidth="3" />
        <path d={`M${i} ${i} H${gapL} M${gapR} ${i} H${W - i} M${i} ${H - i} H${W - i}`} stroke={t.accent2} />
        <path d={`M${o + d} ${o + d} V${H - o - d} M${W - o - d} ${o + d} V${H - o - d}`} stroke={t.accent2} />
      </g>
      {/* Both bands are drawn with x = 0 at the paper edge; the right one is mirrored. */}
      <g transform={`translate(${o} ${o + d})`}>{band}</g>
      <g transform={`translate(${W - o} ${o + d}) scale(-1 1)`}>{band}</g>
      {corners.map(([cx, cy], k) => (
        <Rosette key={k} cx={cx} cy={cy} r={FRAME.rosetteR} c={t.accent} c2={t.accent2} paper={t.paper} />
      ))}
    </svg>
  );
}

export function DevotionalTemplate({
  data,
  motif,
  page = 1
}: {
  data: Biodata;
  motif: Motif;
  page?: 1 | 2;
}) {
  const t = DEV_THEMES[motif];
  const l = labelsFor(data.docLocale);
  const built = buildSections(data);
  const cols = ROW_COLS[t.layout];
  const isPage2 = page === 2 && !!t.twoPage;

  // Page 1 carries the document; page 2, where a theme has one, carries the
  // closing sections and the two larger photos.
  const page2Sections = [built.about, built.expectations, built.contact];
  const page1Sections = t.twoPage
    ? [built.personal, built.education, built.family, built.horoscope]
    : built.sections;

  return (
    <article
      lang={data.docLocale}
      style={{
        position: 'relative',
        width: 'var(--a4-w)',
        height: 'var(--a4-h)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: t.paper,
        color: t.ink,
        fontFamily: t.body,
        fontSize: (t.layout === 'centered' ? 14.5 : 15.5) - (t.runsLarge ? 0.8 : 0),
        lineHeight: t.layout === 'centered' ? 1.32 : 1.36
      }}
    >
      {/* The outer rule stays 20px from the paper edge, about 5.3mm: inside what
          a home printer can reach. Moving it out again is what the print test caught. */}
      <Frame t={t} motif={motif} />

      <div
        style={{
          position: 'relative',
          padding: `${FRAME.figure.top}px ${FRAME.padX}px 32px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textAlign: 'center' }}>
          <div style={{ width: FRAME.figure.w, height: FRAME.figure.h }}>
            {t.figure ? (
              // Never loading="lazy": page 2 is off-screen when Chromium prints, so
              // a lazy image would never decode and PrintReady would never fire.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.figure} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <DeityLogo motif={motif} c={t.accent} c2={t.accent2} />
            )}
          </div>
          <p lang={t.invLang} style={{ margin: 0, fontFamily: t.invFont, fontSize: 15, color: t.accent }}>
            {t.invocation}
          </p>
        </header>

        {isPage2 ? (
          <>
            {page2Sections.map((sec, i) => (
              <Block key={i} sec={sec} t={t} cols={cols} />
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 18 }}>
              <Photo t={t} data={data} width={240} height={320} alt={l.photoPlaceholder} />
              <Photo t={t} data={data} width={240} height={320} alt={l.photoPlaceholder} />
            </div>
          </>
        ) : t.layout === 'classic' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 176px', gap: 20, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: t.accent }}>{built.kicker}</p>
                <h1
                  style={{
                    margin: '0 0 6px',
                    fontFamily: t.head,
                    fontWeight: t.headWeight,
                    fontSize: 32,
                    lineHeight: 1.15,
                    color: t.accent
                  }}
                >
                  {built.name}
                </h1>
                <Rows rows={built.personal.rows} t={t} cols={cols} />
              </div>
              <Photo t={t} data={data} width={176} height={224} alt={l.photoPlaceholder} />
            </div>
            {page1Sections.slice(1).map((sec, i) => (
              <Block key={i} sec={sec} t={t} cols={cols} />
            ))}
          </>
        ) : t.layout === 'centered' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textAlign: 'center' }}>
              <Photo t={t} data={data} width={78} height={78} round alt={l.photoPlaceholder} />
              <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 600, color: t.accent }}>{built.kicker}</p>
              <h1 style={{ margin: 0, fontFamily: t.head, fontWeight: t.headWeight, fontSize: 26, lineHeight: 1.15, color: t.accent }}>
                {built.name}
              </h1>
              {built.subtitle ? <p style={{ margin: 0, fontSize: 17, color: t.label }}>{built.subtitle}</p> : null}
            </div>
            {page1Sections.map((sec, i) => (
              <div key={i} style={{ width: '100%', maxWidth: 690, margin: '0 auto' }}>
                <Block sec={sec} t={t} cols={cols} ruled />
              </div>
            ))}
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '218px minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, borderRadius: 10, background: t.tint }}>
              <Photo t={t} data={data} width="100%" height={226} alt={l.photoPlaceholder} />
              <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {built.facts.map((f, i) => (
                  <div key={i}>
                    <dt style={{ fontSize: 14, color: t.label }}>{f.l}</dt>
                    <dd style={{ margin: 0, fontWeight: 600 }}>{f.v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: t.accent }}>{built.kicker}</p>
                <h1 style={{ margin: 0, fontFamily: t.head, fontWeight: t.headWeight, fontSize: 30, lineHeight: 1.2, color: t.accent }}>
                  {built.name}
                </h1>
                {built.subtitle ? <p style={{ margin: 0, fontSize: 17, color: t.label }}>{built.subtitle}</p> : null}
              </div>
              {page1Sections.slice(1).map((sec, i) => (
                <section key={i} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <h2
                    style={{
                      margin: '0 0 1px',
                      paddingBottom: 3,
                      borderBottom: `1px solid ${t.accent2}`,
                      fontFamily: t.head,
                      fontWeight: t.headWeight,
                      fontSize: 18,
                      lineHeight: 1.25,
                      color: t.accent
                    }}
                  >
                    {sec.title}
                  </h2>
                  {sec.text ? <p style={{ margin: 0, textWrap: 'pretty' }}>{sec.text}</p> : null}
                  <Rows rows={sec.rows} t={t} cols={cols} />
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
