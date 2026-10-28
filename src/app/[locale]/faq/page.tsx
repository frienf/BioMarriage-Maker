import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return { title: t('title'), description: t('lede') };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('faq');
  const items = [1, 2, 3, 4, 5, 6, 7, 8] as const;

  return (
    <>
      <SiteHeader active="faq" />
      <main id="main" className="shell" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className="page-title">{t('title')}</h1>
          <p className="lede">{t('lede')}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((n) => (
            <details key={n} style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-card)', background: 'var(--paper)' }}>
              <summary
                style={{
                  cursor: 'pointer',
                  listStyle: 'revert',
                  padding: '16px 20px',
                  minHeight: 'var(--tap-md)',
                  fontSize: 19,
                  fontWeight: 600
                }}
              >
                {t(`q${n}` as 'q1')}
              </summary>
              <p className="muted" style={{ padding: '0 20px 20px' }}>
                {t(`a${n}` as 'a1')}
              </p>
            </details>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
