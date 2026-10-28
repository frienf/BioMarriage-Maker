'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useTransition } from 'react';

const NAMES: Record<string, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

/** Switches the site language, keeping the visitor on the same page. */
export function LocaleSwitch({ label, dark }: { label: string; dark?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 'var(--tap)', color: dark ? '#fff' : 'var(--ink)' }}>
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
      </svg>
      <span className="visually-hidden">{label}</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(() => router.replace(pathname, { locale: next as (typeof routing.locales)[number] }));
        }}
        style={{
          font: 'inherit',
          color: 'inherit',
          background: 'transparent',
          border: `1px solid ${dark ? 'var(--teal-600)' : 'var(--line)'}`,
          borderRadius: 'var(--r-control)',
          padding: '8px 10px',
          minHeight: 'var(--tap)'
        }}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l} style={{ color: 'var(--ink)' }}>
            {NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
