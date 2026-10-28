'use client';

import { useState, type ReactNode } from 'react';
import type { Swatch } from '@/templates/catalog';

/**
 * Colour swatches that recolour the preview.
 *
 * The previews are rendered on the server, one per swatch, and passed in as
 * nodes; this component only chooses which one is shown. That keeps the
 * template components off the client bundle entirely.
 */
export function ColourPicker({
  swatches,
  previews,
  caption,
  side,
  colourLabel
}: {
  swatches: Swatch[];
  previews: ReactNode[];
  caption: string;
  side: ReactNode;
  /** Rendered with the chosen swatch's name, e.g. "Colour: Kumkum maroon". */
  colourLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const current = swatches[index];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
      <div
        style={{
          flex: '1 1 520px',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: '32px 16px',
          borderRadius: 'var(--r-panel)',
          background: 'var(--canvas)'
        }}
      >
        {/* All four sheets stay mounted in one grid cell and crossfade. The
            alternative, unmounting the old sheet and mounting a fresh A4, costs
            a few hundred milliseconds before anything appears, and a colour
            swatch has to answer immediately. */}
        <div className="crossfade">
          {previews.map((node, i) => (
            <div key={i} aria-hidden={i !== index}>
              {node}
            </div>
          ))}
        </div>
        <p className="muted xsmall">{caption}</p>
      </div>

      <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {swatches.length > 1 ? (
          <fieldset style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <legend style={{ fontWeight: 600, fontSize: 17, marginBottom: 10 }}>
              {colourLabel.replace('{name}', current?.label ?? '')}
            </legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {swatches.map((s, i) => (
                <button
                  key={s.hex}
                  type="button"
                  aria-label={s.label}
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    cursor: 'pointer',
                    background: s.hex,
                    border: '3px solid var(--paper)',
                    boxShadow: `0 0 0 2px ${i === index ? 'var(--ink)' : 'var(--line)'}`
                  }}
                />
              ))}
            </div>
          </fieldset>
        ) : null}
        {side}
      </div>
    </div>
  );
}
