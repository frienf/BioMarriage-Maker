'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Biodata } from '@/lib/biodata';
import { AlertIcon } from '@/components/toran';

/** Roughly what survives a 1200px JPEG. Bigger and localStorage starts
 *  throwing quota errors on a phone. */
const MAX_EDGE = 1200;
const MAX_BYTES = 3_000_000;

/**
 * The photo never leaves the device here: it is read with FileReader, scaled on
 * a canvas and kept as a data URL in the draft. There is no cropper; the
 * position slider moves the face with CSS object-position, which is the same
 * property the template and the PDF use.
 */
export function PhotoStep({ data, set }: { data: Biodata; set: (p: Partial<Biodata>) => void }) {
  const f = useTranslations('fields');
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const src = data.photo?.src ?? '';
  const positionY = Number((data.photo?.position ?? '50% 30%').split(' ')[1]?.replace('%', '') || 30);

  async function pick(file: File) {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image.');
      return;
    }
    if (file.size > 20_000_000) {
      setError('That photo is very large. Choose one under 20 MB.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no 2d context');
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      let quality = 0.85;
      let url = canvas.toDataURL('image/jpeg', quality);
      while (url.length > MAX_BYTES && quality > 0.4) {
        quality -= 0.1;
        url = canvas.toDataURL('image/jpeg', quality);
      }
      if (url.length > MAX_BYTES) {
        setError('That photo is too large to keep on this device. Try a smaller one.');
        return;
      }
      set({ photo: { src: url, position: data.photo?.position || '50% 30%' } });
    } catch {
      setError('That photo could not be read. Try another one.');
    }
  }

  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 196,
          height: 250,
          flex: 'none',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-control)',
          overflow: 'hidden',
          background: 'var(--canvas)'
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: data.photo?.position || '50% 30%' }}
          />
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%' }} className="muted small">
            {f('photo')}
          </div>
        )}
      </div>

      <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          ref={input}
          id="photo-input"
          type="file"
          accept="image/*"
          className="visually-hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void pick(file);
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button type="button" className="btn btn-primary" onClick={() => input.current?.click()}>
            {f('photoChoose')}
          </button>
          {src ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                set({ photo: { src: '', position: '50% 30%' } });
                if (input.current) input.current.value = '';
              }}
            >
              {f('photoRemove')}
            </button>
          ) : null}
        </div>

        {src ? (
          <label className="field">
            {f('photoPosition')}
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={positionY}
              onChange={(e) => set({ photo: { src, position: `50% ${e.target.value}%` } })}
              style={{ minHeight: 'var(--tap)' }}
            />
          </label>
        ) : null}

        <p className="hint">{f('photoHint')}</p>
        {error ? (
          <p className="error">
            <AlertIcon />
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
