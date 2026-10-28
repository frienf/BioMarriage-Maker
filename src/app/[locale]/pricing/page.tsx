import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Tick } from '@/components/toran';
import { TEMPLATES } from '@/templates/catalog';
import { formatINR } from '@/lib/money';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return { title: t('title'), description: t('lede') };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');

  // Tiers come from the catalogue, so a repriced template cannot leave this
  // page quietly wrong.
  const byPrice = new Map<number, string[]>();
  for (const tpl of TEMPLATES) {
    byPrice.set(tpl.pricePaise, [...(byPrice.get(tpl.pricePaise) ?? []), tpl.title]);
  }
  const tiers = [...byPrice.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([paise, titles], i) => ({ paise, titles, label: [t('tierMinimal'), t('tierStandard'), t('tierPremium')][i] ?? '' }));

  return (
    <>
      <SiteHeader active="pricing" />
      <main id="main" className="shell" style={{ paddingTop: 56, paddingBottom: 96, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className="page-title">{t('title')}</h1>
          <p className="lede">{t('lede')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 24 }}>
          {tiers.map((tier, i) => (
            <div key={tier.paise} className={`card${i === 1 ? ' card-selected' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 18, fontWeight: 600 }}>{tier.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 600, lineHeight: 1.1 }}>{formatINR(tier.paise)}</p>
              <p className="muted small">{tier.titles.join(', ')}</p>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
              {t('includedTitle')}
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[t('inc1'), t('inc2'), t('inc3'), t('inc4'), t('inc5')].map((line) => (
                <li key={line} style={{ display: 'flex', gap: 10 }}>
                  <Tick />
                  {line}
                </li>
              ))}
            </ul>
          </section>
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
              {t('notIncludedTitle')}
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="muted">
              {[t('ni1'), t('ni2'), t('ni3')].map((line) => (
                <li key={line} style={{ display: 'flex', gap: 10 }}>
                  <span aria-hidden="true">—</span>
                  {line}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card band-canvas" style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--canvas)', padding: 28 }}>
          <h2 className="display" style={{ fontSize: 'var(--text-h3)' }}>
            {t('refundTitle')}
          </h2>
          <p className="muted">{t('refundBody')}</p>
          <p className="xsmall muted">{t('taxNote')}</p>
        </section>

        <Link href="/templates" className="btn btn-primary btn-lg" style={{ alignSelf: 'start' }}>
          {t('title')}
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
