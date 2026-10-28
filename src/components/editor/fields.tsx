'use client';

import type { ReactNode } from 'react';
import { AlertIcon } from '@/components/toran';

/** Form primitives. One place for the label, hint and error shape, so no
 *  field in the editor can quietly ship without its error wiring. */

export function Text({
  label,
  value,
  onChange,
  optional,
  hint,
  error,
  type = 'text',
  maxLength,
  span,
  inputMode,
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: string;
  hint?: string;
  error?: string;
  type?: string;
  maxLength?: number;
  span?: boolean;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  autoComplete?: string;
}) {
  const id = `f-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <label className="field" style={span ? { gridColumn: '1 / -1' } : undefined} htmlFor={id}>
      {label}
      {optional ? <span className="hint"> ({optional})</span> : null}
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && !error ? (
        <span id={`${id}-hint`} className="hint">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${id}-err`} className="error">
          <AlertIcon />
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  optional,
  hint,
  maxLength
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: string;
  hint?: string;
  maxLength?: number;
}) {
  const id = `a-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <label className="field" style={{ gridColumn: '1 / -1' }} htmlFor={id}>
      {label}
      {optional ? <span className="hint"> ({optional})</span> : null}
      <textarea id={id} value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} />
      {hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  optional,
  span
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  optional?: string;
  span?: boolean;
}) {
  const id = `s-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <label className="field" style={span ? { gridColumn: '1 / -1' } : undefined} htmlFor={id}>
      {label}
      {optional ? <span className="hint"> ({optional})</span> : null}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="radio-card" style={{ gridColumn: '1 / -1' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <legend>{legend}</legend>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{children}</div>
    </fieldset>
  );
}
