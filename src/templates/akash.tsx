import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE, PortraitPhoto } from './base-parts';

/** Akash (Modern): a coloured side column of quick facts beside a white page. */

const HEAD = 'var(--font-poppins), system-ui, sans-serif';
const BODY = 'var(--font-hind), "Noto Sans Devanagari", system-ui, sans-serif';
const MUTED = '#4A5263';

export function AkashTemplate({ data, accent = '#1F3A68' }: { data: Biodata; accent?: string }) {
  const l = labelsFor(data.docLocale);
  const b = buildSections(data);
  const facts = b.personal.rows.slice(0, 6);

  return (
    <article
      lang={data.docLocale}
      style={{
        ...PAGE,
        display: 'grid',
        gridTemplateColumns: '262px minmax(0, 1fr)',
        background: '#FFFFFF',
        color: '#1E2430',
        fontFamily: BODY,
        fontSize: 16,
        lineHeight: 1.5
      }}
    >
      <aside style={{ background: accent, color: '#FFFFFF', padding: '48px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PortraitPhoto
          data={data}
          alt={l.photoPlaceholder}
          width={198}
          height={248}
          tint="rgba(255,255,255,0.14)"
          silhouette="rgba(255,255,255,0.3)"
          style={{ borderRadius: 10, border: '3px solid #FFFFFF' }}
        />
        <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {facts.map((f, i) => (
            <div key={i}>
              <dt style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>{f.l}</dt>
              <dd style={{ margin: 0, fontWeight: 500 }}>{f.v}</dd>
            </div>
          ))}
        </dl>
        {b.contact.rows.length ? (
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.28)'
            }}
          >
            <p style={{ margin: 0, fontFamily: HEAD, fontWeight: 600, fontSize: 15 }}>{b.contact.title}</p>
            {b.contact.rows.map((r, i) => (
              <p key={i} style={{ margin: 0, fontSize: 15 }}>
                {r.v}
              </p>
            ))}
          </div>
        ) : null}
      </aside>

      <div style={{ padding: '52px 48px 48px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 18, borderBottom: `2px solid ${accent}` }}>
          <h1
            style={{
              margin: 0,
              fontFamily: HEAD,
              fontWeight: 600,
              fontSize: 36,
              lineHeight: 1.15,
              letterSpacing: '-0.4px',
              color: accent
            }}
          >
            {b.name}
          </h1>
          {b.subtitle ? <p style={{ margin: 0, fontSize: 18, color: MUTED }}>{b.subtitle}</p> : null}
        </header>

        {b.about.text ? (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 600, fontSize: 18, color: accent }}>{b.about.title}</h2>
            <p style={{ margin: 0, textWrap: 'pretty' }}>{b.about.text}</p>
          </section>
        ) : null}

        {[b.education, b.family, b.horoscope].map((sec) =>
          sec.rows.length ? (
            <section key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 600, fontSize: 18, color: accent }}>{sec.title}</h2>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '130px minmax(0, 1fr)', gap: '4px 16px' }}>
                {sec.rows.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
                    <dt style={{ color: MUTED }}>{r.l}</dt>
                    <dd style={{ margin: 0 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null
        )}

        {b.expectations.text ? (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ margin: 0, fontFamily: HEAD, fontWeight: 600, fontSize: 18, color: accent }}>{b.expectations.title}</h2>
            <p style={{ margin: 0, textWrap: 'pretty' }}>{b.expectations.text}</p>
          </section>
        ) : null}
      </div>
    </article>
  );
}
