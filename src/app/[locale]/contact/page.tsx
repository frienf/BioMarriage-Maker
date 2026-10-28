import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title'), description: t('lede') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <>
      <SiteHeader active="contact" />
      <main id="main" className="shell" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className="page-title">{t('title')}</h1>
          <p className="lede">{t('lede')}</p>
        </div>

        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 24 }}>
          <div className="card">
            <dt className="muted small">{t('emailLabel')}</dt>
            <dd style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{t('email')}</dd>
          </div>
          <div className="card">
            <dt className="muted small">{t('hoursLabel')}</dt>
            <dd style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{t('hours')}</dd>
          </div>
        </dl>

        {/* A plain mailto form: it opens the visitor's own mail app, so no
            message, and no biodata, passes through our server. */}
        <form
          action={`mailto:${t('email')}`}
          method="post"
          encType="text/plain"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <label className="field">
            {t('orderLabel')}
            <input name="order" type="text" placeholder="BM-20261019-000123" />
            <span className="hint">{t('orderHint')}</span>
          </label>
          <label className="field">
            {t('messageLabel')}
            <textarea name="message" />
          </label>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'start' }}>
            {t('send')}
          </button>
          <p className="hint">{t('sendNote')}</p>
        </form>

        <section className="card band-canvas" style={{ background: 'var(--canvas)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 className="display" style={{ fontSize: 'var(--text-h3)' }}>
            {t('findOrder')}
          </h2>
          <p className="muted">{t('findOrderBody')}</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
