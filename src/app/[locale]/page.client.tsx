'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FadeIn, StaggeredFadeIn, SlideIn } from '@/components/animations';
import { HoverScale, HoverLift } from '@/components/animations/HoverScale';
import { ToranFieldCanvas } from '@/components/animations';

import { ScaledSheet, TemplateSheet } from '@/templates/render';
import { sampleFor } from '@/templates/sample';
import { TEMPLATES } from '@/templates/catalog';
import { formatINR } from '@/lib/money';
import type { DocLocale } from '@/lib/biodata';
import { ToranStrip } from '@/components/toran';

interface HeroItem {
  slug: string;
  rotate: number;
  left?: number;
  right?: number;
  top: number;
  z: number;
  locale: DocLocale;
  center?: boolean;
}

const HERO: readonly HeroItem[] = [
  { slug: 'akash', rotate: -7, left: 0, top: 40, z: 1, locale: 'en' as DocLocale },
  { slug: 'marathi-paramparik', rotate: 7, right: 0, top: 40, z: 1, locale: 'mr' as DocLocale },
  { slug: 'kumkum', rotate: 0, center: true, top: 0, z: 2, locale: 'en' as DocLocale },
] as const;

const STYLE_CARDS = [
  { slug: 'kumkum', titleKey: 'Traditional', locale: 'en' as DocLocale },
  { slug: 'ganesh-mangal', titleKey: 'Devotional', locale: 'en' as DocLocale },
  { slug: 'akash', titleKey: 'Modern', locale: 'en' as DocLocale },
  { slug: 'saral', titleKey: 'Minimal', locale: 'en' as DocLocale },
  { slug: 'mayur', titleKey: 'Premium', locale: 'en' as DocLocale },
  { slug: 'marathi-paramparik', titleKey: 'Hindi and Marathi first', locale: 'mr' as DocLocale },
] as const;

const STYLE_BLURBS: Record<string, string> = {
  Traditional: 'Framed and centred, with ivory, maroon and gold.',
  Devotional: 'Ganesha, Krishna, Shiva, Lakshmi and more, each with its own watermark.',
  Modern: 'Two columns in navy and white, easy to scan.',
  Minimal: 'Quiet sage and charcoal, nothing extra.',
  Premium: 'Editorial type with a fine peacock border.',
  'Hindi and Marathi first': 'Laid out for Devanagari from the start.',
};

function sheet(slug: string, locale: DocLocale, width: number) {
  const def = TEMPLATES.find((t) => t.slug === slug)!;
  const data = { ...sampleFor(slug, locale), templateSlug: slug };
  return (
    <ScaledSheet width={width} label={`${def.title} example`}>
      <TemplateSheet data={data} accent={def.accent} instanceId={`home-${slug}`} />
    </ScaledSheet>
  );
}

export function HomePageAnimations({
  _locale,
  cheapest,
  tiers,
}: {
  _locale: DocLocale;
  cheapest: number;
  tiers: Array<{ label: string; paise: number; who: string; selected: boolean }>;
}) {
  const t = useTranslations('home');
  return (
    <>
      {/* Toran field: mango leaves & marigold flowers */}
      <ToranFieldCanvas
        leafCount={28}
        flowerCount={18}
        speed={0.7}
        interactive={true}
      />

      <main id="main">
        {/* Hero Section */}
        <section aria-labelledby="hero-title" className="band-dark hero" style={{ paddingBlock: 0 }}>
          <div aria-hidden="true" className="hero-bg" />
          <div aria-hidden="true" className="hero-scrim" />
          <ToranStrip />
          <div
            className="shell"
            style={{
              paddingTop: 40,
              paddingBottom: 96,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(460px, 100%), 1fr))',
              gap: 48,
              alignItems: 'center',
            }}
          >
            {/* Left side - text content with staggered entrance */}
            <StaggeredFadeIn staggerDelay={0.12} className="flex flex-col gap-7">
              <FadeIn delay={0.1} style={{ marginBottom: -8 }}>
                <h1 id="hero-title" className="hero-title">
                  {t('title')}
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="lede" style={{ fontSize: 20, maxWidth: '34em' }}>
                  {t('lede')}
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  <SlideIn direction="left">
                    <Link href="/templates" className="btn btn-accent btn-lg">
                      {t('ctaPrimary')}
                    </Link>
                  </SlideIn>
                  <SlideIn direction="right">
                    <Link href="/templates" className="btn btn-outline-light btn-lg">
                      {t('ctaSecondary')}
                    </Link>
                  </SlideIn>
                </div>
              </FadeIn>
              <FadeIn delay={0.5}>
                <ul style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '12px 28px', color: 'var(--teal-050)', fontSize: 16 }}>
                  {[t('proof1', { price: formatINR(cheapest) }), t('proof2'), t('proof3')].map((line) => (
                    <FadeIn key={line} delay={0.05}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span role="img" aria-hidden="true" style={{ color: 'var(--marigold)' }}>✓</span>
                        {line}
                      </li>
                    </FadeIn>
                  ))}
                </ul>
              </FadeIn>
            </StaggeredFadeIn>

            {/* Right side - template examples with hover lift */}
            <FadeIn delay={0.4} y={30}>
              <div
                role="img"
                aria-label={t('examplesLabel')}
                style={{ position: 'relative', height: 500, width: '100%', maxWidth: 560, justifySelf: 'center' }}
              >
                {HERO.map((h, index) => (
                  <HoverLift key={h.slug} style={{
                    position: 'absolute',
                    left: h.center ? '50%' : h.left,
                    right: h.right,
                    top: h.top,
                    marginLeft: h.center ? -143 : undefined,
                    zIndex: h.z,
                    transform: `rotate(${h.rotate}deg)`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: h.z === 2 ? '0 24px 56px rgba(0, 20, 18, 0.55)' : 'var(--shadow-card)',
                    transitionDelay: `${index * 0.1}s`,
                  }}>
                    {sheet(h.slug, h.locale, 286)}
                  </HoverLift>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* How it works section */}
        <section aria-labelledby="how-title" className="shell band">
          <FadeIn>
            <h2 id="how-title" className="section-title" style={{ marginBottom: 40 }}>
              {t('howTitle')}
            </h2>
          </FadeIn>
          <StaggeredFadeIn staggerDelay={0.15}>
            {[1, 2, 3].map((n) => (
              <HoverLift key={n} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 1, color: 'var(--marigold-deep)' }}>
                  {n}
                </span>
                <FadeIn delay={0.1}>
                  <h3 style={{ fontSize: 22, fontWeight: 600 }}>{t(`how${n}Title` as 'how1Title')}</h3>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="muted">{t(`how${n}Body` as 'how1Body', { count: TEMPLATES.length })}</p>
                </FadeIn>
              </HoverLift>
            ))}
          </StaggeredFadeIn>
        </section>

        {/* Language section */}
        <section aria-labelledby="lang-title" className="band-canvas">
          <div className="shell band grid-2" style={{ alignItems: 'start' }}>
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 id="lang-title" className="section-title" style={{ textWrap: 'balance' }}>
                  {t('langTitle')}
                </h2>
                <p className="lede" style={{ maxWidth: '30em' }}>
                  {t('langBody')}
                </p>
              </div>
            </FadeIn>
            <SlideIn direction="right" delay={0.2}>
              <div className="table-wrap">
                <table className="plain">
                  <thead>
                    <tr>
                      <th scope="col">English</th>
                      <th scope="col" lang="hi">हिन्दी</th>
                      <th scope="col" lang="mr">मराठी</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Date of birth', 'जन्म तिथि', 'जन्मतारीख'],
                      ["Father's occupation", 'पिता का व्यवसाय', 'वडिलांचा व्यवसाय'],
                      ['Native place', 'मूल निवास', 'मूळ गाव'],
                      ['Education', 'शिक्षा', 'शिक्षण']
                    ].map(([en, hi, mr]) => (
                      <tr key={en}>
                        <td>{en}</td>
                        <td lang="hi">{hi}</td>
                        <td lang="mr">{mr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Styles section with animated cards */}
        <section aria-labelledby="styles-title" className="shell band" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'end' }}>
            <FadeIn>
              <h2 id="styles-title" className="section-title">
                {t('stylesTitle')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Link href="/templates" style={{ fontWeight: 600, fontSize: 18 }}>
                {t('stylesLink', { count: TEMPLATES.length })}
              </Link>
            </FadeIn>
          </div>
          <StaggeredFadeIn staggerDelay={0.08} className="grid-2">
            {STYLE_CARDS.slice(0, 4).map((c) => (
              <div key={c.titleKey} className="template-card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 'var(--r-card)', border: '1px solid var(--line)', background: 'var(--paper)', minWidth: 0, position: 'relative', overflow: 'hidden' }}>
                <FadeIn>
                  <Link href={`/templates/${c.slug}`} style={{ display: 'block', width: '100%', maxWidth: 200, margin: '0 auto', borderRadius: 4, border: '1px solid var(--line)', textDecoration: 'none', cursor: 'zoom-in', position: 'relative', zIndex: 1, overflow: 'visible' }}>
                    <HoverScale scale={1.08} tapScale={0.98} hoverDuration={0.25} style={{ display: 'block', transformOrigin: 'center center' }}>
                      {sheet(c.slug, c.locale, 160)}
                    </HoverScale>
                  </Link>
                </FadeIn>
                <FadeIn delay={0.06}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, textAlign: 'center', margin: 0 }}>{c.titleKey}</h3>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <p className="muted small" style={{ textAlign: 'center', margin: 0, lineHeight: 1.4 }}>{STYLE_BLURBS[c.titleKey]}</p>
                </FadeIn>
                <FadeIn delay={0.12}>
                  <Link href={`/templates/${c.slug}`} className="btn btn-outline-brand" style={{ minHeight: 40, fontSize: 14, width: '100%', justifyContent: 'center' }}>
                    Use this template
                  </Link>
                </FadeIn>
              </div>
            ))}
          </StaggeredFadeIn>
        </section>

        {/* Privacy section */}
        <section aria-labelledby="privacy-title" className="band-canvas">
          <div className="shell band grid-2">
            <FadeIn>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 id="privacy-title" className="section-title">
                  {t('privacyTitle')}
                </h2>
                <p className="lede" style={{ maxWidth: '28em' }}>
                  {t('privacyBody')}
                </p>
                <Link href="/legal" style={{ fontWeight: 600 }}>
                  {t('privacyLink')}
                </Link>
              </div>
            </FadeIn>
            <StaggeredFadeIn staggerDelay={0.1} className="grid-3">
              {[1, 2, 3, 4].map((n) => (
                <HoverLift key={n} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <FadeIn delay={0.1}>
                    <h3 style={{ fontSize: 20, fontWeight: 600 }}>{t(`privacy${n}Title` as 'privacy1Title')}</h3>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="muted" style={{ fontSize: 17 }}>
                      {t(`privacy${n}Body` as 'privacy1Body')}
                    </p>
                  </FadeIn>
                </HoverLift>
              ))}
            </StaggeredFadeIn>
          </div>
        </section>

        {/* Pricing section */}
        <section aria-labelledby="price-title" className="shell band" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <FadeIn>
            <h2 id="price-title" className="section-title">
              {t('priceTitle')}
            </h2>
          </FadeIn>
          <StaggeredFadeIn staggerDelay={0.12} className="grid-3">
            {tiers.map((tier) => (
              <HoverLift key={tier.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <FadeIn>
                  <div className={`card${tier.selected ? ' card-selected' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p style={{ fontSize: 18, fontWeight: 600 }}>{tier.label}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 600, lineHeight: 1.1 }}>
                      {formatINR(tier.paise)}
                    </p>
                    <p className="muted small">{tier.who}</p>
                  </div>
                </FadeIn>
              </HoverLift>
            ))}
          </StaggeredFadeIn>
          <FadeIn delay={0.4}>
            <p className="muted">
              {t('priceFoot')}{' '}
              <Link href="/pricing" style={{ fontWeight: 600 }}>
                {t('priceLink')}
              </Link>
            </p>
          </FadeIn>
        </section>

        {/* CTA section */}
        <section aria-labelledby="cta-title" className="band-dark">
          <div
            className="shell"
            style={{
              paddingBlock: 80,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px 48px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <SlideIn direction="left">
              <h2 id="cta-title" className="section-title" style={{ maxWidth: '18em' }}>
                {t('ctaTitle')}
              </h2>
            </SlideIn>
            <SlideIn direction="right" delay={0.1}>
              <SlideIn direction="left" className="btn btn-accent btn-lg">
                {t('ctaPrimary')}
              </SlideIn>
            </SlideIn>
          </div>
        </section>
      </main>
    </>
  );
}