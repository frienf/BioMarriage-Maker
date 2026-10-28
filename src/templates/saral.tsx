import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { PAGE } from './base-parts';

/** Saral (Minimal): no frame, no photo, no ornament. Light weights and one
 *  hairline rule per section. It is the proof that the field model degrades
 *  gracefully when a family fills in almost nothing. */

const BODY = 'var(--font-mukta), "Noto Sans Devanagari", system-ui, sans-serif';
const LABEL = '#5B5F5C';
const RULE = '#DCD8CC';

export function SaralTemplate({ data, accent = '#4E6853' }: { data: Biodata; accent?: string }) {
  const b = buildSections(data);
  const blocks = [b.personal, b.education, b.family, b.horoscope, b.about, b.expectations, b.contact].filter(
    (s) => s.rows.length || s.text
  );

  return (
    <article
      lang={data.docLocale}
      style={{
        ...PAGE,
        padding: '46px 60px 36px',
        background: '#F7F4EC',
        color: '#2E3230',
        fontFamily: BODY,
        fontSize: 14.5,
        lineHeight: 1.36,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <h1 style={{ margin: 0, fontWeight: 300, fontSize: 34, lineHeight: 1.1, letterSpacing: '-0.5px' }}>{b.name}</h1>
        {b.subtitle ? <p style={{ margin: 0, color: accent, fontSize: 16 }}>{b.subtitle}</p> : null}
        <div aria-hidden="true" style={{ width: 56, height: 2, background: accent, marginTop: 4 }} />
      </header>

      {blocks.map((sec, i) => (
        <section
          key={sec.title}
          style={{
            display: 'grid',
            gridTemplateColumns: '146px minmax(0, 1fr)',
            gap: '6px 26px',
            paddingTop: i === 0 ? 0 : 11,
            borderTop: i === 0 ? 'none' : `1px solid ${RULE}`
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 600, fontSize: 16, color: accent }}>{sec.title}</h2>
          {sec.text ? (
            <p style={{ margin: 0, textWrap: 'pretty' }}>{sec.text}</p>
          ) : (
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '136px minmax(0, 1fr)', gap: '0px 14px' }}>
              {sec.rows.map((r, j) => (
                <div key={j} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                  <dt style={{ color: LABEL }}>{r.l}</dt>
                  <dd style={{ margin: 0 }}>{r.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}
    </article>
  );
}
