import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE, PortraitPhoto } from './base-parts';

/** Mayur (Premium): editorial display type, a peacock-feather mark and a
 *  two-column body, with a coloured spine down the left edge. */

const HEAD = 'var(--font-eczar), Georgia, serif';
const BODY = 'var(--font-martel), "Noto Serif Devanagari", Georgia, serif';
const GOLD = '#B08D45';
const LABEL = '#5A6566';
const RULE = '#D8CCAE';

export function MayurTemplate({ data, accent = '#0E4F57' }: { data: Biodata; accent?: string }) {
  const l = labelsFor(data.docLocale);
  const b = buildSections(data);
  const quad = [b.personal, b.education, b.family, b.horoscope].filter((s) => s.rows.length);

  return (
    <article
      lang={data.docLocale}
      style={{ ...PAGE, background: '#FFFDF9', color: '#1F2A2B', fontFamily: BODY, fontSize: 15, lineHeight: 1.38 }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: accent }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 3, background: GOLD }} />

      <div style={{ position: 'relative', padding: '40px 60px 32px 76px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 140px', gap: 26, alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <svg aria-hidden="true" width="34" height="46" viewBox="0 0 44 60">
              <path d="M22 58 C 22 44, 22 30, 22 22" stroke={GOLD} strokeWidth="1.5" fill="none" />
              <ellipse cx="22" cy="20" rx="17" ry="19" fill="none" stroke={GOLD} strokeWidth="1.5" />
              <ellipse cx="22" cy="21" rx="11" ry="13" fill={accent} />
              <ellipse cx="22" cy="23" rx="5.5" ry="6.5" fill="#173B6B" />
              <circle cx="22" cy="22" r="2" fill="#E2C77E" />
            </svg>
            <h1
              style={{
                margin: 0,
                fontFamily: HEAD,
                fontWeight: 600,
                fontSize: 42,
                lineHeight: 1.02,
                letterSpacing: '-0.6px',
                color: accent
              }}
            >
              {b.name}
            </h1>
            {b.subtitle ? <p style={{ margin: 0, fontWeight: 300, fontSize: 17, color: '#3E4B4C' }}>{b.subtitle}</p> : null}
          </div>
          <PortraitPhoto
            data={data}
            alt={l.photoPlaceholder}
            width={140}
            height={176}
            tint="#E7EEEC"
            silhouette="#C9D7D4"
            style={{ borderRadius: '78px 78px 4px 4px', border: `1px solid ${GOLD}` }}
          />
        </header>

        {b.about.text ? (
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.45,
              color: '#2D3A3B',
              textWrap: 'pretty',
              padding: '11px 0',
              borderTop: `1px solid ${RULE}`,
              borderBottom: `1px solid ${RULE}`
            }}
          >
            {b.about.text}
          </p>
        ) : null}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px 36px' }}>
          {quad.map((sec) => (
            <section key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 500, fontSize: 19, color: accent }}>{sec.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr)', gap: '1px 12px' }}>
                {sec.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: LABEL, fontSize: 14, paddingTop: 2 }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {b.expectations.text ? (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 500, fontSize: 19, color: accent }}>{b.expectations.title}</h2>
            <p style={{ margin: 0, textWrap: 'pretty' }}>{b.expectations.text}</p>
          </section>
        ) : null}

        {b.contact.rows.length ? (
          <footer
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 32px',
              paddingTop: 12,
              borderTop: `1px solid ${RULE}`,
              fontSize: 15,
              color: '#3E4B4C'
            }}
          >
            {b.contact.rows.map((r, i) => (
              <span key={i}>{r.v}</span>
            ))}
          </footer>
        ) : null}
      </div>
    </article>
  );
}
