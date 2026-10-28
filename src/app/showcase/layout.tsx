import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { siteFontClass } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Template showcase',
  robots: { index: false, follow: false }
};

/**
 * Outside the locale routing on purpose: this is an evaluation route, not part
 * of the buying flow, so it never joins the 90 prerendered pages and never
 * appears in the sitemap.
 */
export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={siteFontClass}>
      <body>{children}</body>
    </html>
  );
}
