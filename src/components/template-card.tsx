import { Link } from '@/i18n/navigation';
import { formatINR } from '@/lib/money';
import type { DocLocale } from '@/lib/biodata';
import { sampleFor } from '@/templates/sample';
import { ScaledSheet, TemplateSheet } from '@/templates/render';
import type { TemplateDef } from '@/templates/catalog';

const LANG_NAMES: Record<DocLocale, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

/** A gallery card. The thumbnail is the real template at 1/3 scale, filled with
 *  fictional sample details, so what you click is what you get. */
export function TemplateCard({ def, collectionLabel }: { def: TemplateDef; collectionLabel: string }) {
  const previewLocale = def.docLocales[0];
  const data = { ...sampleFor(def.slug, previewLocale), templateSlug: def.slug };

  return (
    <Link
      href={`/templates/${def.slug}`}
      style={{
        color: 'var(--ink)',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 10,
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-card)',
        background: 'var(--paper)',
        width: '100%',
        minHeight: 150
      }}
    >
      <div style={{ width: 160, borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 0 var(--line)', flexShrink: 0 }}>
        <ScaledSheet width={144} label={`${def.title} template preview`}>
          <TemplateSheet data={data} accent={def.accent} instanceId={def.slug} />
        </ScaledSheet>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, lineHeight: 1.2, margin: 0 }}>{def.title}</h3>
          <span style={{ fontWeight: 600, fontSize: 17 }}>{formatINR(def.pricePaise)}</span>
        </div>
        <p className="xsmall muted" style={{ margin: 0 }}>{collectionLabel}</p>
        <ul aria-label="Languages" style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {def.docLocales.map((l) => (
            <li key={l} lang={l} className="pill" style={{ fontSize: 12, padding: '4px 8px' }}>
              {LANG_NAMES[l]}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
