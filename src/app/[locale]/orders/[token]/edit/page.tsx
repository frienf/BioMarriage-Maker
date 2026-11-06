import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PaidEditorLoader } from '@/components/editor/paid-editor-loader';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ locale: string; token: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'order' });
  return { title: t('editAction'), robots: { index: false, follow: false } };
}

export default async function EditOrderPage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  return <PaidEditorLoader token={token} />;
}
