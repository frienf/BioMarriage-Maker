import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { motionTokens } from '../src/lib/motion-tokens.ts';

/**
 * Some motion is driven by CSS (the colour crossfade, the hero drift) and some
 * by JavaScript. Both read from a token set, but they are different files, so
 * this is what stops them drifting apart.
 */
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

function cssVar(name: string): string {
  const m = new RegExp(`--${name}:\s*([^;]+);`).exec(css);
  assert.ok(m, `--${name} is not defined in globals.css`);
  return m![1].trim();
}

test('the CSS durations match the JavaScript tokens', () => {
  for (const [key, seconds] of Object.entries(motionTokens.duration)) {
    const declared = cssVar(`motion-${key}`);
    assert.match(declared, /^\d+ms$/, `--motion-${key} should be written in ms`);
    assert.equal(parseInt(declared, 10), Math.round(seconds * 1000), `--motion-${key} drifted from motionTokens.duration.${key}`);
  }
});

test('the CSS easing matches the smooth token', () => {
  const [a, b, c, d] = motionTokens.easing.smooth;
  assert.equal(cssVar('motion-smooth'), `cubic-bezier(${a}, ${b}, ${c}, ${d})`);
});

test('the hero loop is long enough to read as ambient', () => {
  const loop = parseInt(cssVar('hero-loop'), 10);
  assert.ok(loop >= 8 && loop <= 30, `a ${loop}s loop is outside the 8-30s ambient range`);
});

test('travel distances stay short enough for a document, not a slideshow', () => {
  for (const [key, px] of Object.entries(motionTokens.distance)) {
    assert.ok(px > 0 && px <= 40, `distance.${key} is ${px}px`);
  }
});
