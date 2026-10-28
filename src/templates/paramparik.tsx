import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE, PortraitPhoto } from './base-parts';

/**
 * Paramparik: laid out for Devanagari from the start, not a Latin template with
 * Hindi dropped in. Serves both the Marathi-first and Hindi-first entries; the
 * heading face and the numerals follow the document language.
 *
 * Marathi convention on these documents is Devanagari numerals; Hindi biodata
 * in the market mostly keeps Latin digits, so that is what each gets.
 */

const BODY = 'var(--font-mukta), "Noto Sans Devanagari", sans-serif';
const GOLD = '#C2963F';
const LABEL = '#6A4E3E';
const RULE = '#E2CBA8';

export function ParamparikTemplate({
  data,
  accent = '#8A2A1C',
  /** Unique per instance: several of these can share one gallery page. */
  instanceId = 'p'
}: {
  data: Biodata;
  accent?: string;
  instanceId?: string;
}) {
  const head =
    data.docLocale === 'mr'
      ? 'var(--font-tiro-mr), "Noto Serif Devanagari", serif'
      : 'var(--font-tiro-hi), "Noto Serif Devanagari", serif';
  const numerals = data.docLocale === 'mr' ? 'devanagari' : 'latin';
  const l = labelsFor(data.docLocale);
  const b = buildSections(data, numerals);
  const patternId = `jhalar-${instanceId}`;
  const blocks = [b.personal, b.education, b.family, b.horoscope, b.about, b.expectations, b.contact].filter(
    (s) => s.rows.length || s.text
  );

  return (
    <article
      lang={data.docLocale}
      style={{ ...PAGE, background: '#FFF8EE', color: '#2B1E16', fontFamily: BODY, fontSize: 15.5, lineHeight: 1.4 }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 18, background: accent }} />
      <svg aria-hidden="true" width="794" height="16" viewBox="0 0 794 16" style={{ position: 'absolute', left: 0, top: 18 }}>
        <defs>
          <pattern id={patternId} width="22" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 0 Q 11 16 22 0 Z" fill={accent} />
          </pattern>
        </defs>
        <rect width="794" height="12" fill={`url(#${patternId})`} />
      </svg>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: accent }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 10, height: 3, background: GOLD }} />

      <div style={{ position: 'relative', padding: '32px 50px 26px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 146px', gap: 22, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <p style={{ margin: 0, fontFamily: head, fontSize: 16, color: accent }}>{l.invocation}</p>
            <p style={{ margin: 0, fontSize: 14, color: LABEL }}>{b.kicker}</p>
            <h1 style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: 32, lineHeight: 1.25, color: accent }}>
              {b.name}
            </h1>
            {b.subtitle ? <p style={{ margin: 0, fontSize: 16, color: '#4A362B' }}>{b.subtitle}</p> : null}
          </div>
          <PortraitPhoto
            data={data}
            alt={l.photoPlaceholder}
            width={146}
            height={188}
            tint="#F3E4D0"
            silhouette="#E0C9AE"
            style={{ borderRadius: '82px 82px 6px 6px', border: `2px solid ${GOLD}` }}
          />
        </header>

        {blocks.map((sec) => (
          <section key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 5, borderTop: `1px solid ${RULE}` }}>
            <h2 style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: 18, lineHeight: 1.3, color: accent }}>
              {sec.title}
            </h2>
            {sec.text ? (
              <p style={{ margin: 0, textWrap: 'pretty' }}>{sec.text}</p>
            ) : (
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '132px minmax(0, 1fr)', gap: '0px 12px' }}>
                {sec.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: LABEL }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
