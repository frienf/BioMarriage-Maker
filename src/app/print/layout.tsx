import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { templateFontClass } from '@/lib/fonts';
import '../globals.css';
import './print.css';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * The page Chromium prints. No locale prefix, no site chrome, nothing that
 * could push the sheet off the paper.
 */
export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={templateFontClass}>
      <body>{children}</body>
    </html>
  );
}
