import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default async function NotFound() {
  const t = await getTranslations('common');
  return (
    <>
      <SiteHeader />
      <main id="main" className="shell band" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 className="page-title">{t('notFoundTitle')}</h1>
        <p className="lede">{t('notFoundBody')}</p>
        <Link href="/templates" className="btn btn-primary" style={{ alignSelf: 'start' }}>
          {t('backHome')}
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
