import { setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ScaledSheet, TemplateSheet } from '@/templates/render';
import { sampleFor } from '@/templates/sample';
import { TEMPLATES } from '@/templates/catalog';
import type { DocLocale } from '@/lib/biodata';
import { HomePageAnimations } from './page.client';

const _HERO = [
  { slug: 'akash', rotate: -7, left: 0, top: 40, z: 1, locale: 'en' as DocLocale },
  { slug: 'marathi-paramparik', rotate: 7, right: 0, top: 40, z: 1, locale: 'mr' as DocLocale },
  { slug: 'kumkum', rotate: 0, center: true, top: 0, z: 2, locale: 'en' as DocLocale },
];

const _STYLE_CARDS = [
  { slug: 'kumkum', titleKey: 'Traditional', locale: 'en' as DocLocale },
  { slug: 'ganesh-mangal', titleKey: 'Devotional', locale: 'en' as DocLocale },
  { slug: 'akash', titleKey: 'Modern', locale: 'en' as DocLocale },
  { slug: 'saral', titleKey: 'Minimal', locale: 'en' as DocLocale },
  { slug: 'mayur', titleKey: 'Premium', locale: 'en' as DocLocale },
  { slug: 'marathi-paramparik', titleKey: 'Hindi and Marathi first', locale: 'mr' as DocLocale },
];

const _STYLE_BLURBS: Record<string, string> = {
  Traditional: 'Framed and centred, with ivory, maroon and gold.',
  Devotional: 'Ganesha, Krishna, Shiva, Lakshmi and more, each with its own watermark.',
  Modern: 'Two columns in navy and white, easy to scan.',
  Minimal: 'Quiet sage and charcoal, nothing extra.',
  Premium: 'Editorial type with a fine peacock border.',
  'Hindi and Marathi first': 'Laid out for Devanagari from the start.',
};

function _sheet(slug: string, locale: DocLocale, width: number) {
  const def = TEMPLATES.find((t) => t.slug === slug)!;
  const data = { ...sampleFor(slug, locale), templateSlug: slug };
  return (
    <ScaledSheet width={width} label={`${def.title} example`}>
      <TemplateSheet data={data} accent={def.accent} instanceId={`home-${slug}`} />
    </ScaledSheet>
  );
}

const cheapest = Math.min(...TEMPLATES.map((x) => x.pricePaise));
const tiers = [
  { label: 'Minimal', paise: 2900, who: 'Saral and Shuddh', selected: false },
  { label: 'Standard', paise: 4900, who: 'Traditional, devotional, modern, Hindi-first and Marathi-first', selected: true },
  { label: 'Premium', paise: 9900, who: 'Mayur and Kamal', selected: false },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader variant="dark" active="home" />
      <HomePageAnimations _locale={locale as DocLocale} cheapest={cheapest} tiers={tiers} />
      <SiteFooter />
    </>
  );
}