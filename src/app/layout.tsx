import type { ReactNode } from 'react';

/**
 * A passthrough. `html` and `body` live in [locale]/layout.tsx and in
 * print/layout.tsx, because the document language belongs to the route and the
 * print page deliberately has no locale prefix.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
