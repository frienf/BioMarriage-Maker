import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { LabelRows, PAGE, PortraitPhoto } from './base-parts';

/** Kumkum (Traditional): double-ruled frame, gold corner diamonds, centred
 *  headings, with an optional Ganesha invocation above the name. */

const GOLD = '#B48A3E';
const LABEL = '#6B4F45';
const HEAD = 'var(--font-tiro-hi), "Noto Serif Devanagari", Georgia, serif';
const BODY = 'var(--font-martel), "Noto Serif Devanagari", Georgia, serif';

function Diamond({ accent, style }: { accent: string; style: React.CSSProperties }) {
  return (
    <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34" style={{ position: 'absolute', ...style }}>
      <path d="M17 3 L31 17 L17 31 L3 17 Z" fill="#FBF6EA" stroke={accent} strokeWidth="2" />
      <path d="M17 10 L24 17 L17 24 L10 17 Z" fill={GOLD} />
    </svg>
  );
}

export function KumkumTemplate({ data, accent = '#7B1E2B' }: { data: Biodata; accent?: string }) {
  const l = labelsFor(data.docLocale);
  const b = buildSections(data);
  const cols = '150px minmax(0, 1fr)';

  return (
    <article
      lang={data.docLocale}
      style={{ ...PAGE, background: '#FBF6EA', color: '#2A1D18', fontFamily: BODY, fontSize: 15, lineHeight: 1.36 }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 22, border: `2px solid ${accent}` }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 30, border: `1px solid ${GOLD}` }} />
      <Diamond accent={accent} style={{ left: 13, top: 13 }} />
      <Diamond accent={accent} style={{ right: 13, top: 13 }} />
      <Diamond accent={accent} style={{ left: 13, bottom: 13 }} />
      <Diamond accent={accent} style={{ right: 13, bottom: 13 }} />

      <div style={{ position: 'relative', padding: '34px 52px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textAlign: 'center' }}>
          <p lang="hi" style={{ margin: 0, fontFamily: HEAD, fontSize: 16, color: accent }}>
            ॥ श्री गणेशाय नमः ॥
          </p>
          <h1 style={{ margin: 0, fontFamily: HEAD, fontWeight: 400, fontSize: 32, lineHeight: 1.15, color: accent }}>
            {b.name}
          </h1>
          <svg aria-hidden="true" width="260" height="10" viewBox="0 0 300 14">
            <line x1="0" y1="7" x2="136" y2="7" stroke={GOLD} strokeWidth="1" />
            <line x1="164" y1="7" x2="300" y2="7" stroke={GOLD} strokeWidth="1" />
            <path d="M150 1 L156 7 L150 13 L144 7 Z" fill={GOLD} />
          </svg>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 158px', gap: 22, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 400, fontSize: 19, color: accent }}>{b.personal.title}</h2>
            <LabelRows rows={b.personal.rows} cols={cols} labelColor={LABEL} />
          </div>
          <PortraitPhoto
            data={data}
            alt={l.photoPlaceholder}
            width={158}
            height={198}
            tint="#F1E6D8"
            silhouette="#DCC8B2"
            style={{ border: `1px solid ${GOLD}`, padding: 6, background: '#FFFFFF' }}
          />
        </section>

        {[b.education, b.family, b.horoscope].map((sec) =>
          sec.rows.length ? (
            <section key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 400, fontSize: 19, color: accent }}>{sec.title}</h2>
              <LabelRows rows={sec.rows} cols={cols} labelColor={LABEL} />
            </section>
          ) : null
        )}

        {[b.about, b.expectations].map((sec) =>
          sec.text ? (
            <section key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 400, fontSize: 19, color: accent }}>{sec.title}</h2>
              <p style={{ margin: 0, textWrap: 'pretty' }}>{sec.text}</p>
            </section>
          ) : null
        )}

        {b.contact.rows.length ? (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 400, fontSize: 19, color: accent }}>{b.contact.title}</h2>
            <LabelRows rows={b.contact.rows} cols={cols} labelColor={LABEL} />
          </section>
        ) : null}
      </div>
    </article>
  );
}
