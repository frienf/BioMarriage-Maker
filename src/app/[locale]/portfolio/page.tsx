import { setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';


export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'hi' }, { locale: 'mr' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return {
    title: 'Portfolio · Biodata Maker',
    description: 'Interactive 3D organic gallery piece',
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader variant="dark" active="none" />
      <section style={{ minHeight: '100vh', background: '#0a2c2b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Portfolio gallery removed.</p>
      </section>
      <SiteFooter />
    </>
  );
}
