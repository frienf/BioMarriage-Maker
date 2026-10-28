/**
 * Catches characters the template fonts cannot draw, before they reach a PDF
 * and print as empty boxes on someone's biodata.
 *
 * ponytail: an allow-list of the scripts our faces actually cover, not a real
 * cmap read. Upgrade to parsing each woff2's cmap if we ever ship a template
 * whose font covers less than its script.
 */
const ALLOWED = [
  [0x0009, 0x000a], // tab, newline
  [0x000d, 0x000d],
  [0x0020, 0x007e], // Basic Latin
  [0x00a0, 0x00ff], // Latin-1 Supplement
  [0x0100, 0x017f], // Latin Extended-A
  [0x0900, 0x097f], // Devanagari
  [0x200c, 0x200d], // ZWNJ / ZWJ, needed for Devanagari conjuncts
  [0x2010, 0x2015], // hyphens and dashes
  [0x2018, 0x201f], // curly quotes
  [0x2026, 0x2026], // ellipsis
  [0x20b9, 0x20b9], // rupee sign
  [0x00d7, 0x00d7] // multiplication sign, used for heights
] as const;

function covered(cp: number): boolean {
  return ALLOWED.some(([lo, hi]) => cp >= lo && cp <= hi);
}

/** Distinct characters in `text` that no template font can draw. */
export function unsupportedGlyphs(text: string): string[] {
  const bad = new Set<string>();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp !== undefined && !covered(cp)) bad.add(ch);
  }
  return [...bad];
}

/** Every unsupported character across an object's string values. */
export function unsupportedIn(value: unknown): string[] {
  const bad = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') unsupportedGlyphs(v).forEach((c) => bad.add(c));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(value);
  return [...bad];
}
