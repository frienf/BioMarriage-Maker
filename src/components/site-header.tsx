import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { BrandMark } from './toran';
import { LocaleSwitch } from './locale-switch';

type Active = 'home' | 'templates' | 'pricing' | 'faq' | 'contact' | 'none';

export async function SiteHeader({ variant = 'light', active = 'none' }: { variant?: 'light' | 'dark'; active?: Active }) {
  const t = await getTranslations('nav');
  const dark = variant === 'dark';
  const fg = dark ? '#fff' : 'var(--ink)';

  const items: Array<{ id: Active; label: string; href: string }> = [
    { id: 'templates', label: t('templates'), href: '/templates' },
    { id: 'pricing', label: t('pricing'), href: '/pricing' },
    { id: 'faq', label: t('faq'), href: '/faq' },
    { id: 'contact', label: t('help'), href: '/contact' }
  ];

  return (
    <header
      style={{
        color: fg,
        background: dark ? 'var(--teal-800)' : 'var(--paper)',
        borderBottom: `1px solid ${dark ? 'var(--teal-600)' : 'var(--line)'}`
      }}
    >
      <a
        href="#main"
        className="btn btn-primary"
        style={{ position: 'absolute', left: -9999, top: 8, zIndex: 10 }}
        onFocus={undefined}
      >
        {t('skipToContent')}
      </a>
      <div
        className="shell"
        style={{ paddingBlock: 14, minHeight: 60, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 32px' }}
      >
        <Link
          href="/"
          aria-label={`${t('brand')} ${t('home')}`}
          style={{ display: 'flex', alignItems: 'center', gap: 10, color: fg, textDecoration: 'none', minHeight: 'var(--tap)' }}
        >
          <BrandMark dark={dark} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.2px' }}>
            {t('brand')}
          </span>
        </Link>

        <nav aria-label="Main" style={{ flex: '1 1 auto' }}>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
            {items.map((it) => {
              const on = it.id === active;
              return (
                <li key={it.id}>
                  <Link
                    href={it.href}
                    aria-current={on ? 'page' : undefined}
                    className="nav-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 'var(--tap)',
                      paddingInline: 10,
                      fontSize: 17,
                      fontWeight: on ? 600 : 500,
                      color: fg,
                      textDecoration: 'none',
                      borderBottom: `2px solid ${on ? (dark ? 'var(--marigold)' : 'var(--teal-800)') : 'transparent'}`
                    }}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <LocaleSwitch label={t('language')} dark={dark} />
          <Link href="/templates" className={`btn ${dark ? 'btn-accent' : 'btn-primary'}`}>
            {t('create')}
          </Link>
        </div>
      </div>
    </header>
  );
}
