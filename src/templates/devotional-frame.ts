/**
 * Where the devotional frame sits on the 794 x 1123 sheet, in CSS px.
 * Values from docs/superpowers/specs/2026-10-20-devotional-frames-design.md;
 * tests/devotional-frame.test.ts holds them to "no ornament inside the text box".
 */
export const FRAME = {
  outer: 20,
  inner: 28,
  band: 34,
  bandUnit: 44,
  padX: 70,
  rosetteR: 21,
  figure: { w: 140, h: 120, top: 26 },
  tile: { cell: 150, size: 44, top: 150, bottom: 1095 }
} as const;

/** Where the half-drop tile grid is anchored: one column on the page's centre
 *  line, the first row flush under FRAME.tile.top. With these numbers no tile is
 *  ever cut by the side bands or the tile area; the test fails if a change
 *  to FRAME starts slicing them. */
export const TILE_ORIGIN = {
  x: 794 / 2 - FRAME.tile.cell / 4,
  y: FRAME.tile.top + FRAME.tile.size / 2 - FRAME.tile.cell / 4
} as const;

/**
 * Centre of every watermark tile on the sheet: the half-drop grid from
 * TILE_ORIGIN, kept to the tiles that sit wholly inside the tile area.
 * Drawn as plain elements, not an SVG <pattern>: Chromium prints a pattern fill
 * as a low-resolution bitmap, and these must stay vector in the PDF.
 */
export function tileCenters(): Array<{ x: number; y: number }> {
  const { cell, size, top, bottom } = FRAME.tile;
  const left = FRAME.outer + FRAME.band;
  const right = 794 - left;
  const out: Array<{ x: number; y: number }> = [];
  for (let row = 0; ; row++) {
    const y = TILE_ORIGIN.y + cell / 4 + (row * cell) / 2;
    if (y + size / 2 > bottom) break;
    if (y - size / 2 < top) continue;
    const first = TILE_ORIGIN.x + (row % 2 ? (3 * cell) / 4 : cell / 4);
    // Step left to the first column that still fits, then walk right.
    let x = first - Math.floor((first - size / 2 - left) / cell) * cell;
    for (; x + size / 2 <= right; x += cell) out.push({ x, y });
  }
  return out;
}
