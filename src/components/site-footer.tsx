import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function SiteFooter() {
  const t = await getTranslations('common');
  const nav = await getTranslations('nav');

  const groups: Array<{ label: string; links: Array<{ href: string; label: string; lang?: string }> }> = [
    {
      label: t('footerMake'),
      links: [
        { href: '/templates', label: nav('templates') },
        { href: '/pricing', label: nav('pricing') },
        { href: '/editor', label: t('footerOpenEditor') }
      ]
    },
    {
      label: t('footerHelp'),
      links: [
        { href: '/faq', label: nav('faq') },
        { href: '/contact', label: t('footerFindOrder') },
        { href: '/contact', label: t('footerContact') }
      ]
    },
    {
      label: t('footerLegal'),
      links: [
        { href: '/legal', label: t('footerPrivacy') },
        { href: '/legal', label: t('footerTerms') },
        { href: '/legal', label: t('footerRefunds') }
      ]
    }
  ];

  return (
    <footer style={{ background: 'var(--teal-900)', color: 'var(--teal-050)', fontSize: 16 }}>
      <div className="shell" style={{ paddingTop: 64, paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: '#fff' }}>{nav('brand')}</p>
            <p style={{ maxWidth: '22em' }}>{t('footerTagline')}</p>
          </div>
          {groups.map((g) => (
            <nav key={g.label} aria-label={g.label}>
              <p style={{ marginBottom: 12, fontWeight: 600, color: '#fff' }}>{g.label}</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {g.links.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={l.href}
                      style={{ display: 'inline-flex', minHeight: 36, alignItems: 'center', color: 'var(--teal-050)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label={t('footerLanguages')}>
            <p style={{ marginBottom: 12, fontWeight: 600, color: '#fff' }}>{t('footerLanguages')}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>
                <Link href="/" locale="en" style={{ display: 'inline-flex', minHeight: 36, alignItems: 'center', color: 'var(--teal-050)' }}>
                  English biodata
                </Link>
              </li>
              <li>
                <Link href="/" locale="hi" lang="hi" style={{ display: 'inline-flex', minHeight: 36, alignItems: 'center', color: 'var(--teal-050)' }}>
                  हिंदी बायोडाटा
                </Link>
              </li>
              <li>
                <Link href="/" locale="mr" lang="mr" style={{ display: 'inline-flex', minHeight: 36, alignItems: 'center', color: 'var(--teal-050)' }}>
                  मराठी बायोडाटा
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 24,
            borderTop: '1px solid var(--teal-500)',
            fontSize: 15,
            color: 'var(--muted-on-dark)'
          }}
        >
          <p>{t('footerCompany', { year: new Date().getFullYear() })}</p>
          <p>{t('footerRazorpay')}</p>
        </div>
      </div>
    </footer>
  );
}
