import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRAME, TILE_ORIGIN, tileCenters } from '../src/templates/devotional-frame.ts';

const A4_W = 794; // matches A4.w in src/templates/render.tsx

test('bands and rosettes stay out of the text box', () => {
  assert.ok(FRAME.outer + FRAME.band < FRAME.padX, 'a band would run under the text');
  assert.ok(FRAME.outer + FRAME.band / 2 + FRAME.rosetteR < FRAME.padX, 'a rosette would sit on a row label');
});

test('tiles start below the figure, so none show through a transparent PNG', () => {
  assert.ok(FRAME.tile.top >= FRAME.figure.top + FRAME.figure.h);
});

test('no watermark tile is cut by the edges of the tile area', () => {
  const { cell, size, top, bottom } = FRAME.tile;
  const left = FRAME.outer + FRAME.band;
  const right = A4_W - left;
  // Half-drop grid: across both row types, tiles sit every cell/2 in x and in y.
  const whole = (c: number, lo: number, hi: number) => {
    const a = c - size / 2;
    const b = c + size / 2;
    return (a >= lo && b <= hi) || b <= lo || a >= hi;
  };
  for (let k = -4; k < 2 * Math.ceil(1123 / cell) + 4; k++) {
    const y = TILE_ORIGIN.y + cell / 4 + (k * cell) / 2;
    assert.ok(whole(y, top, bottom), `a tile row at y=${y} is sliced by the tile area`);
    const x = TILE_ORIGIN.x + cell / 4 + (k * cell) / 2;
    assert.ok(whole(x, left, right), `a tile column at x=${x} is sliced by a side band`);
  }
});

test('the figure slot is narrower than the text box', () => {
  assert.ok(FRAME.figure.w < A4_W - 2 * FRAME.padX);
});

test('the watermark is 59 whole tiles inside the tile area, one on the centre line', () => {
  const { size, top, bottom } = FRAME.tile;
  const left = FRAME.outer + FRAME.band;
  const right = A4_W - left;
  const tiles = tileCenters();
  assert.equal(tiles.length, 59);
  for (const t of tiles) {
    const inside = t.x - size / 2 >= left && t.x + size / 2 <= right && t.y - size / 2 >= top && t.y + size / 2 <= bottom;
    assert.ok(inside, `tile at ${t.x},${t.y} leaves the tile area`);
  }
  assert.ok(tiles.some((t) => t.x === A4_W / 2 && t.y === top + size / 2), 'no tile on the centre line under the figure');
});
