import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ReviewPay } from '@/components/review-pay';

export const metadata: Metadata = { title: 'Review and pay', robots: { index: false, follow: false } };

export default async function ReviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <SiteHeader />
      <ReviewPay />
      <SiteFooter />
    </>
  );
}
