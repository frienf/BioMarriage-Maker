'use client';

import dynamic from 'next/dynamic';

/**
 * The client boundary that keeps three.js out of everything else.
 *
 * `ssr: false` because there is no WebGL context on the server, and it has to
 * live in a client component: Next refuses it in a server one.
 */
const Showcase = dynamic(() => import('./scene').then((m) => m.Showcase), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'grid', placeItems: 'center', height: '100dvh', background: 'var(--canvas)' }}>
      <p className="muted">Preparing the sheet…</p>
    </div>
  )
});

export function ShowcaseLoader() {
  return <Showcase />;
}
