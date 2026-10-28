/**
 * The toran: a strip of hanging mango leaves and marigolds, tied across a
 * doorway for a wedding. It is the one piece of ornament the site itself wears,
 * and the reason the look is called Toran.
 */
export function ToranStrip({ height = 56 }: { height?: number }) {
  return (
    <svg aria-hidden="true" width="100%" height={height} style={{ display: 'block' }}>
      <defs>
        <pattern id="toran-strip" width="48" height="56" patternUnits="userSpaceOnUse">
          <line x1="0" y1="6" x2="48" y2="6" stroke="var(--gold-on-dark)" strokeWidth="2" />
          <path d="M24 6 C 13 18, 15 36, 24 48 C 33 36, 35 18, 24 6 Z" fill="var(--toran-leaf)" />
          <path d="M24 10 L24 44" stroke="var(--toran-stem)" strokeWidth="1.5" />
          <circle cx="0" cy="12" r="7" fill="var(--marigold)" />
          <circle cx="48" cy="12" r="7" fill="var(--marigold)" />
          <circle cx="0" cy="12" r="2.5" fill="var(--marigold-deep)" />
          <circle cx="48" cy="12" r="2.5" fill="var(--marigold-deep)" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="url(#toran-strip)" />
    </svg>
  );
}

/** The brand mark: the same toran, shrunk to a logo. */
export function BrandMark({ dark }: { dark?: boolean }) {
  const gold = dark ? 'var(--gold-on-dark)' : 'var(--gold)';
  const leaf = dark ? 'var(--leaf-on-dark)' : 'var(--leaf)';
  return (
    <svg aria-hidden="true" width="34" height="28" viewBox="0 0 34 28">
      <path d="M2 5 Q17 11 32 5" fill="none" stroke={gold} strokeWidth="2" />
      <path d="M9 7.5 C 5 12, 6 19, 9 24 C 12 19, 13 12, 9 7.5 Z" fill={leaf} />
      <path d="M17 9 C 13 14, 14 21, 17 26 C 20 21, 21 14, 17 9 Z" fill={leaf} />
      <path d="M25 7.5 C 21 12, 22 19, 25 24 C 28 19, 29 12, 25 7.5 Z" fill={leaf} />
      <circle cx="13" cy="8.6" r="2.6" fill="var(--marigold)" />
      <circle cx="21" cy="8.6" r="2.6" fill="var(--marigold)" />
    </svg>
  );
}

export function Tick({ color = 'var(--teal-800)', size = 20 }: { color?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: 'none' }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function LockIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function AlertIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}
