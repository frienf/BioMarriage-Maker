'use client';
import { useEffect, useState } from 'react';
import type { Biodata } from '@/lib/biodata';
import { buildSections } from './rows';
import { labelsFor } from './labels';
import { PAGE } from './base-parts';
import type { Manifest } from './schema';
import type { PhotoCrop } from './types';

type Props = {
  data: Biodata;
  manifestId: string;
  accent?: string;
  page?: 1 | 2;
  manifest?: Manifest;
  photoCrop?: PhotoCrop;
};

export function ArtworkTemplate({ data, manifestId, accent: _accent, manifest: manifestProp, photoCrop }: Props) {
  const [manifest, setManifest] = useState<Manifest | null>(manifestProp ?? null);

  useEffect(() => {
    if (manifestProp) { setManifest(manifestProp); return; }
    // fetch manifest from public
    fetch(`/templates/${manifestId}/manifest.json`)
      .then((r) => r.json())
      .then((m) => setManifest(m))
      .catch(() => setManifest(null));
  }, [manifestId, manifestProp]);

  if (!manifest) return <article style={{ ...PAGE, background: '#fff' }} />;

  const b = buildSections(data);
  const crop = photoCrop ?? { scale: 1, offsetX: 0, offsetY: 0 };
  const slot = manifest.photoSlot.box;
  const inset = manifest.photoSlot.inset;
  const content = manifest.contentArea;

  // clip-path for photo shape
  const shape = manifest.photoSlot.shape;
  const radius = manifest.photoSlot.radius ?? 0;
  const clipStyle: React.CSSProperties =
    shape === 'circle'
      ? { clipPath: `circle(${(0.5 - inset) * 100}% at 50% 50%)` }
      : shape === 'rounded-rect'
      ? { clipPath: `inset(${inset * 100}% round ${radius * 100}%)` }
      : shape === 'arch'
      ? { clipPath: `path('M ${inset} 1 L ${inset} 0.35 Q 0.5 ${inset} ${1 - inset} 0.35 L ${1 - inset} 1 Z')` }
      : { clipPath: manifest.photoSlot.path ? `path('${manifest.photoSlot.path}')` : undefined };

  return (
    <article lang={data.docLocale} style={{ ...PAGE, position: 'relative', overflow: 'hidden', background: '#fff' }}>
      {/* Layer 1: background untouched */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/templates/${manifest.id}/background.webp?v=${manifest.version}`}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none' }}
      />
      {/* Layer 2: photo */}
      <div
        style={{
          position: 'absolute',
          left: `${slot.x * 100}%`,
          top: `${slot.y * 100}%`,
          width: `${slot.w * 100}%`,
          height: `${slot.h * 100}%`,
          overflow: 'hidden',
          ...clipStyle,
        }}
      >
        {data.photo?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photo.src}
            alt={labelsFor(data.docLocale).photoPlaceholder}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: data.photo.position || '50% 30%',
              transform: `translate(${crop.offsetX * 100}%, ${crop.offsetY * 100}%) scale(${crop.scale})`,
              transformOrigin: 'center center',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#666' }}>
            Add photo
          </div>
        )}
      </div>
      {/* Layer 3: content */}
      <div
        style={{
          position: 'absolute',
          left: `${content.x * 100}%`,
          top: `${content.y * 100}%`,
          width: `${content.w * 100}%`,
          height: `${content.h * 100}%`,
          overflow: 'hidden',
          color: manifest.theme.text,
          fontFamily: manifest.theme.fontBody,
          fontSize: manifest.theme.baseSize,
        }}
      >
        <h1 style={{ fontFamily: manifest.theme.fontHeading, color: manifest.theme.heading, fontSize: manifest.theme.baseSize * 1.6, margin: 0 }}>
          {b.name}
        </h1>
        {b.subtitle ? <p style={{ margin: '4px 0 8px', fontSize: manifest.theme.baseSize * 1.1 }}>{b.subtitle}</p> : null}
        {b.sections.map((sec) => (
          sec.rows.length || sec.text ? (
            <section key={sec.title} style={{ marginBottom: 8 }}>
              <h2 style={{ fontFamily: manifest.theme.fontHeading, color: manifest.theme.heading, fontSize: manifest.theme.baseSize * 1.2, margin: '6px 0 2px', borderBottom: `1px solid ${manifest.theme.divider}` }}>
                {sec.title}
              </h2>
              {sec.rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: manifest.theme.baseSize }}>
                  <span style={{ color: manifest.theme.heading, minWidth: 90 }}>{r.l}</span>
                  <span>{r.v}</span>
                </div>
              ))}
              {sec.text ? <p style={{ margin: 0, fontSize: manifest.theme.baseSize }}>{sec.text}</p> : null}
            </section>
          ) : null
        ))}
      </div>
    </article>
  );
}
