import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { OrderPanel, type OrderStatus } from '@/components/order-panel';
import { orderByToken } from '@/lib/orders';
import { templateBySlug } from '@/templates/catalog';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your order', robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('order');

  const order = await orderByToken(token);

  if (!order) {
    return (
      <>
        <SiteHeader />
        <main id="main" className="shell band" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 className="page-title">{t('notFound')}</h1>
          <Link href="/contact" className="btn btn-primary" style={{ alignSelf: 'start' }}>
            {t('retry')}
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const def = templateBySlug(order.templateSlug);
  const initial: OrderStatus = {
    status: order.status as OrderStatus['status'],
    pdfStatus: order.pdfStatus as OrderStatus['pdfStatus'],
    orderNumber: order.orderNumber,
    downloadsUsed: order.downloadsUsed,
    downloadLimit: order.downloadLimit,
    editsUsed: order.editsUsed,
    editLimit: order.editLimit,
    expiresAt: order.expiresAt ? order.expiresAt.toISOString() : null,
    deleted: order.deletedAt !== null
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="shell" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 className="page-title">{t('title')}</h1>
          <p className="muted small">{def ? def.title : order.templateSlug}</p>
        </div>
        <OrderPanel token={token} initial={initial} />
      </main>
      <SiteFooter />
    </>
  );
}
