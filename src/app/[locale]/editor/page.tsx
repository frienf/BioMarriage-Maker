import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Editor } from '@/components/editor/editor';
import { templateBySlug, TEMPLATES } from '@/templates/catalog';

export const metadata: Metadata = { title: 'Editor', robots: { index: false, follow: false } };

export default async function EditorPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ template?: string; sample?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const slug = templateBySlug(sp.template ?? '')?.slug ?? TEMPLATES[0].slug;
  return <Editor initialSlug={slug} useSample={sp.sample === '1'} />;
}
