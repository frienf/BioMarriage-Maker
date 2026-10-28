import type { CSSProperties } from 'react';
import type { Biodata } from '@/lib/biodata';
import type { Row } from './rows';

/** Shared pieces for the non-devotional templates. */

export function LabelRows({
  rows,
  cols,
  labelColor,
  labelSize = 14
}: {
  rows: Row[];
  cols: string;
  labelColor: string;
  labelSize?: number;
}) {
  return (
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: cols, gap: '1px 14px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'subgrid', gridColumn: '1 / -1' }}>
          <dt style={{ color: labelColor, fontSize: labelSize, paddingTop: 2 }}>{r.l}</dt>
          <dd style={{ margin: 0 }}>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PortraitPhoto({
  data,
  alt,
  width,
  height,
  style,
  tint,
  silhouette
}: {
  data: Biodata;
  alt: string;
  width: number | string;
  height: number;
  style?: CSSProperties;
  tint: string;
  silhouette: string;
}) {
  return (
    <figure style={{ margin: 0, width, height, boxSizing: 'border-box', overflow: 'hidden', flex: 'none', ...style }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: tint,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 'inherit'
        }}
      >
        {data.photo?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photo.src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: data.photo.position || '50% 30%' }}
          />
        ) : (
          <svg aria-hidden="true" width="70%" viewBox="0 0 120 150">
            <circle cx="60" cy="56" r="28" fill={silhouette} />
            <path d="M8 150 C 14 104, 36 92, 60 92 C 84 92, 106 104, 112 150 Z" fill={silhouette} />
          </svg>
        )}
      </div>
    </figure>
  );
}

/** A4 page shell. Every template sits on exactly this box. */
export const PAGE: CSSProperties = {
  position: 'relative',
  width: 'var(--a4-w)',
  height: 'var(--a4-h)',
  boxSizing: 'border-box',
  overflow: 'hidden'
};
