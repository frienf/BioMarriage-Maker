import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Tick } from '@/components/toran';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return { title: t('title'), description: t('lede') };
}

/**
 * Structure and a plain-language summary only.
 *
 * The three formal sections are left as marked placeholders on purpose: a
 * privacy policy and a refund policy are legal undertakings about a real
 * company, and nothing here invents one. Counsel fills them in.
 */
export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const sections = ['privacyTitle', 'termsTitle', 'refundTitle'] as const;

  return (
    <>
      <SiteHeader />
      <main id="main" className="shell" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className="page-title">{t('title')}</h1>
          <p className="lede">{t('lede')}</p>
        </div>

        <section className="card band-canvas" style={{ background: 'var(--canvas)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
            {t('summaryTitle')}
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['s1', 's2', 's3', 's4', 's5'] as const).map((k) => (
              <li key={k} style={{ display: 'flex', gap: 10 }}>
                <Tick />
                {t(k)}
              </li>
            ))}
          </ul>
        </section>

        {sections.map((k) => (
          <section key={k} id={k} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 className="display" style={{ fontSize: 'var(--text-h2-sm)' }}>
              {t(k)}
            </h2>
            <p
              className="muted"
              style={{ padding: 20, border: '1px dashed var(--chip-line)', borderRadius: 'var(--r-card)', textWrap: 'pretty' }}
            >
              {t('placeholder')}
            </p>
          </section>
        ))}

        <p className="xsmall muted">{t('updated')}</p>
      </main>
      <SiteFooter />
    </>
  );
}
