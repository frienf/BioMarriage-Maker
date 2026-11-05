import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { TemplateCard } from '@/components/template-card';
import { TemplateGrid } from '@/components/template-grid';
import { COLLECTIONS, TEMPLATES, type Collection } from '@/templates/catalog';
import { DOC_LOCALES, type DocLocale } from '@/lib/biodata';
import { DEITY_IDS, DEITIES, deityLabel, matchesDeity, deitiesWithTemplates } from '@/templates/deities';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return { title: t('title'), description: t('lede') };
}

type Search = { style?: string; lang?: string; q?: string; deity?: string };

/**
 * Filtering is URL state, not component state: the chips are links and the
 * search box is a GET form, so the gallery works with JavaScript switched off
 * and a filtered view can be shared with the family.
 */
export default async function GalleryPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('gallery');

  const style = (COLLECTIONS.find((c) => c.id === sp.style)?.id ?? 'all') as Collection | 'all';
  const lang = (DOC_LOCALES as readonly string[]).includes(sp.lang ?? '') ? (sp.lang as DocLocale) : 'any';
  const q = (sp.q ?? '').trim().toLowerCase();
  const deityParam = (sp.deity ?? '').trim().toLowerCase();
  const deity = (DEITY_IDS as readonly string[]).includes(deityParam) ? (deityParam as (typeof DEITY_IDS)[number]) : null;

  // base filters (style, lang, search) without deity
  const baseShown = TEMPLATES.filter((tpl) => {
    if (style !== 'all' && tpl.collection !== style) return false;
    if (lang !== 'any' && !tpl.docLocales.includes(lang)) return false;
    if (q) {
      const deityLabels = (tpl.deities ?? [])
        .map((d) => {
          const dd = DEITIES.find((x) => x.id === d);
          if (!dd) return '';
          return `${dd.label.en} ${dd.label.hi} ${dd.label.mr} ${dd.aliases.join(' ')}`;
        })
        .join(' ');
      const haystack = `${tpl.title} ${tpl.blurb} ${tpl.collection} ${deityLabels}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const shown = deity ? baseShown.filter((tpl) => matchesDeity(tpl, deity)) : baseShown;

  const href = (next: Partial<{ style: string; lang: string; q: string; deity: string }>) => {
    const p = new URLSearchParams();
    const merged = {
      style: style === 'all' ? '' : style,
      lang: lang === 'any' ? '' : lang,
      q,
      deity: deity ?? '',
      ...next
    };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
    const s = p.toString();
    return s ? `/templates?${s}` : '/templates';
  };

  const chips: Array<{ id: string; label: string }> = [{ id: 'all', label: t('all') }, ...COLLECTIONS];

  // Deity chips: only deities with at least one template (considering base filters)
  const deityChips = deitiesWithTemplates(baseShown).map((id) => ({
    id,
    label: deityLabel(id, locale),
    count: baseShown.filter((tpl) => matchesDeity(tpl, id)).length
  }));

  return (
    <>
      <SiteHeader active="templates" />
      <main id="main" className="shell" style={{ paddingTop: 56, paddingBottom: 96, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className="page-title">{t('title')}</h1>
          <p className="lede">{t('lede')}</p>
        </div>

        <form
          role="search"
          aria-label={t('filterLabel')}
          method="get"
          style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, borderRadius: 'var(--r-card)', background: 'var(--canvas)' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'end' }}>
            <label className="field" style={{ flex: '1 1 280px' }}>
              {t('search')}
              <input type="search" name="q" defaultValue={sp.q ?? ''} placeholder={t('searchHint')} />
            </label>
            <label className="field" style={{ flex: '0 1 220px' }}>
              {t('docLanguage')}
              <select name="lang" defaultValue={lang === 'any' ? '' : lang}>
                <option value="">{t('anyLanguage')}</option>
                <option value="en">English</option>
                <option value="hi" lang="hi">
                  हिन्दी
                </option>
                <option value="mr" lang="mr">
                  मराठी
                </option>
              </select>
            </label>
            {style !== 'all' ? <input type="hidden" name="style" value={style} /> : null}
            {deity ? <input type="hidden" name="deity" value={deity} /> : null}
            <button type="submit" className="btn btn-primary">
              {t('search')}
            </button>
          </div>

          <fieldset style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <legend>{t('style')}</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {chips.map((c) => (
                <Link
                  key={c.id}
                  href={href({ style: c.id === 'all' ? '' : c.id })}
                  className="chip"
                  data-on={c.id === style ? 'true' : 'false'}
                  aria-current={c.id === style ? 'true' : undefined}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </fieldset>

          <fieldset style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <legend>{t('deity')}</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, overflowX: 'auto' }}>
              <Link
                href={href({ deity: '' })}
                className="chip"
                data-on={deity === null ? 'true' : 'false'}
                aria-current={deity === null ? 'true' : undefined}
                aria-pressed={deity === null}
              >
                {t('allDeities')}
              </Link>
              {deityChips.map((c) => {
                const disabled = c.count === 0;
                return (
                  <Link
                    key={c.id}
                    href={disabled ? '#' : href({ deity: c.id })}
                    className="chip"
                    data-on={c.id === deity ? 'true' : 'false'}
                    aria-current={c.id === deity ? 'true' : undefined}
                    aria-pressed={c.id === deity}
                    aria-disabled={disabled ? 'true' : undefined}
                    aria-label={`${c.label}, ${c.count}`}
                    style={disabled ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                  >
                    {c.label} ({c.count})
                  </Link>
                );
              })}
            </div>
          </fieldset>
        </form>

        <p aria-live="polite" className="muted small">
          {t('count', { count: shown.length })}
        </p>

        {shown.length ? (
          <TemplateGrid
            items={shown.map((tpl) => ({
              slug: tpl.slug,
              node: <TemplateCard def={tpl} collectionLabel={COLLECTIONS.find((c) => c.id === tpl.collection)?.label ?? ''} locale={locale} />
            }))}
          />
        ) : (
          <div
            style={{
              padding: '48px 24px',
              border: '1px dashed var(--chip-line)',
              borderRadius: 'var(--r-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              textAlign: 'center'
            }}
          >
            <p style={{ fontSize: 20, fontWeight: 600 }}>{t('noneTitle')}</p>
            <p className="muted">{t('noneBody')}</p>
            {deity ? (
              <Link href={href({ style: '', lang: '', q: '' })} className="btn btn-outline-brand">
                {t('allDesignsForDeity', { name: deityLabel(deity, locale) })}
              </Link>
            ) : (
              <Link href="/templates" className="btn btn-outline-brand">
                {t('clear')}
              </Link>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}