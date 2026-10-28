import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { TemplateCard } from '@/components/template-card';
import { Tick } from '@/components/toran';
import { ColourPicker } from '@/components/colour-picker';
import { COLLECTIONS, SWATCHES, TEMPLATES, templateBySlug } from '@/templates/catalog';
import { ScaledSheet, TemplateSheet } from '@/templates/render';
import { sampleFor } from '@/templates/sample';
import { formatINR } from '@/lib/money';
import { routing } from '@/i18n/routing';

const LANG_NAMES = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' } as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => TEMPLATES.map((t) => ({ locale, slug: t.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const def = templateBySlug(slug);
  return def ? { title: def.title, description: def.blurb } : {};
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const def = templateBySlug(slug);
  if (!def) notFound();

  const t = await getTranslations('detail');
  const collection = COLLECTIONS.find((c) => c.id === def.collection)!;
  const swatches = SWATCHES[def.layout];
  const pickerSwatches = swatches.length ? swatches : [{ hex: def.accent ?? '', label: def.title }];
  const previewLocale = def.docLocales[0];
  const data = { ...sampleFor(def.slug, previewLocale), templateSlug: def.slug };
  const related = TEMPLATES.filter((x) => x.collection === def.collection && x.slug !== def.slug).slice(0, 3);

  return (
    <>
      <SiteHeader active="templates" />
      <main id="main" className="shell" style={{ paddingTop: 32, paddingBottom: 80, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <nav aria-label="Breadcrumb">
          <ol style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 16, color: 'var(--muted)' }}>
            <li>
              <Link href="/templates">{t('breadcrumb')}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/templates?style=${def.collection}`}>{collection.label}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{def.title}</li>
          </ol>
        </nav>

        <ColourPicker
          swatches={pickerSwatches}
          colourLabel={t('colour', { name: '{name}' })}
          caption={t('shownWith', { page: 1, pages: def.pages })}
          previews={pickerSwatches.map((s) => (
            <ScaledSheet key={s.hex} width={492} shadow label={`${def.title} preview`}>
              <TemplateSheet data={data} accent={s.hex} instanceId={`detail-${def.slug}`} />
            </ScaledSheet>
          ))}
          side={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p className="muted small">{t('collection', { name: collection.label })}</p>
                <h1 className="page-title" style={{ fontSize: 'var(--text-h1-lg)', lineHeight: 1.05 }}>
                  {def.title}
                </h1>
                <p style={{ color: 'var(--ink-soft)', textWrap: 'pretty' }}>{def.blurb}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontWeight: 600, fontSize: 17 }}>{t('docLanguages')}</p>
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {def.docLocales.map((l) => (
                    <li key={l} lang={l} className="pill">
                      {LANG_NAMES[l]}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 600, lineHeight: 1 }}>
                    {formatINR(def.pricePaise)}
                  </span>
                  <span className="muted small">{t('oneTime')}</span>
                </div>
                <Link href={`/editor?template=${def.slug}`} className="btn btn-primary btn-lg">
                  {t('use')}
                </Link>
                <p className="muted xsmall" style={{ textAlign: 'center' }}>
                  {t('payAfter')}
                </p>
                <ul style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--line-soft)', fontSize: 16 }}>
                  {[t('inc1'), t('inc2'), t('inc3'), t('inc4')].map((line) => (
                    <li key={line} style={{ display: 'flex', gap: 10 }}>
                      <Tick />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="muted small">{t('continues')}</p>
            </div>
          }
        />

        {related.length ? (
          <section aria-labelledby="more-title" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
            <h2 id="more-title" className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
              {t('moreTitle', { name: collection.label })}
            </h2>
            <ul className="grid-cards">
              {related.map((r) => (
                <li key={r.slug} style={{ display: 'flex' }}>
                  <TemplateCard def={r} collectionLabel={collection.label} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
