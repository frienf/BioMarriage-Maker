/**
 * Deity logos, band units, tile symbols and rosettes for the devotional collection.
 *
 * Every path here is drawn from scratch for this project. The market audit
 * that reviewed them is the reason for several specifics, which must not be
 * "tidied" away without re-reading it:
 *   - Ganesha's trunk turns to his left (vamamukhi), the auspicious form.
 *   - No band or tile carries sacred text (Ram's tile is a sun disc, NOT a
 *     repeated "राम"): sacred text must not sit behind a phone number.
 *   - Krishna's mark is a single feather over a bansuri, deliberately unlike
 *     the crossed flute-and-feather a competitor sells.
 * The one typeface-drawn glyph is ओम, set in Yatra One (SIL OFL, so embedding
 * and commercial use are allowed).
 */

export { MOTIFS, type Motif } from './motifs.ts';
import type { Motif } from './motifs.ts';

type Ink = { c: string; c2: string };

const r2 = (v: number) => Math.round(v * 10) / 10;

/** n evenly spaced angles, optionally offset. */
const rot = (n: number, off = 0) => Array.from({ length: n }, (_, i) => r2((i * 360) / n + off));

const FRETS = [0.38, 0.46, 0.54, 0.62, 0.7, 0.78].map((t) => {
  const x = 26 + 74 * t;
  const y = 80 - 60 * t;
  return { x1: r2(x - 2.52), y1: r2(y - 3.12), x2: r2(x + 2.52), y2: r2(y + 3.12) };
});

function barbs(from: number, to: number, step: number, at: number, len: number, drop: number, rise: number) {
  const out: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let y = from; y <= to; y += step) {
    const L = r2(len - (y - from) * drop);
    out.push({ x1: at, y1: y, x2: r2(at - L), y2: y - rise }, { x1: at, y1: y, x2: r2(at + L), y2: y - rise });
  }
  return out;
}

const KRISHNA_BARBS = barbs(24, 48, 4, 60, 9, 0.25, 5);

/** The crown, tilak, tusks and modak the audit asked for. */
function GaneshaFigure({ c, c2 }: Ink) {
  return (
    <g fill="none" stroke={c} strokeLinecap="round" strokeLinejoin="round">
      <path d="M44 24 L48 12 L54 18 L60 4 L66 18 L72 12 L76 24 Z" fill={c2} fillOpacity="0.35" strokeWidth="2" />
      <circle cx="60" cy="15" r="2.2" fill={c} stroke="none" />
      <path d="M43 25 L77 25" strokeWidth="2.4" />
      <path d="M46 30 C 27 21, 18 46, 33 57 C 38 60, 44 57, 46 50" strokeWidth="2.8" />
      <path d="M74 30 C 93 21, 102 46, 87 57 C 82 60, 76 57, 74 50" strokeWidth="2.8" />
      <path d="M44 35 C 34 32, 29 44, 37 51" strokeWidth="1.3" />
      <path d="M76 35 C 86 32, 91 44, 83 51" strokeWidth="1.3" />
      <path d="M46 27 Q44 44 54 52" strokeWidth="2.6" />
      <path d="M74 27 Q76 44 66 52" strokeWidth="2.6" />
      <path d="M51 37 Q54 34 57 37" strokeWidth="1.6" />
      <path d="M63 37 Q66 34 69 37" strokeWidth="1.6" />
      <circle cx="54" cy="37.6" r="1.3" fill={c} stroke="none" />
      <circle cx="66" cy="37.6" r="1.3" fill={c} stroke="none" />
      <path d="M56.5 27.5 Q60 34 63.5 27.5" stroke={c2} strokeWidth="1.6" />
      <circle cx="60" cy="31.5" r="1.3" fill="#B3261E" stroke="none" />
      <path d="M56 41 Q54 62 60 74 Q66 86 78 80 Q84 76 78 72" strokeWidth="2.8" />
      <path d="M64 41 Q65 58 69 68" strokeWidth="2" />
      <path d="M56.5 52 Q60 54 64.5 52" strokeWidth="1.1" />
      <path d="M57 58 Q61 60 65.5 58" strokeWidth="1.1" />
      <path d="M58.5 64 Q62.5 66 67 63.5" strokeWidth="1.1" />
      <path d="M54 47 L48 55" strokeWidth="2.4" />
      <path d="M66 47 L69 50.5" strokeWidth="2.4" />
      <path d="M33 62 Q28 80 32 96" strokeWidth="2" />
      <path d="M87 62 Q92 80 88 96" strokeWidth="2" />
      <path d="M84 92 C 84 84, 90 80, 92 77 C 94 80, 100 84, 100 92 Z" fill={c2} stroke="none" />
    </g>
  );
}

/** Balaji's shankh: white, spire up and symmetric, so mirroring the right
 *  band cannot turn it into the wrong-handed conch, and with spire bands and
 *  a pointed foot so it never reads as Ganesha's modak. Band coordinates,
 *  inside x 6..28, y 4..40. */
function Shankh({ c }: { c: string }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M17 4 L20.5 9 C 26 12, 28.5 20, 25.5 28 C 23.5 33, 20 36.5, 17 40 C 14 36.5, 10.5 33, 8.5 28 C 5.5 20, 8 12, 13.5 9 Z"
        fill="#FFFFFF"
        stroke={c}
        strokeWidth="1.2"
      />
      <path d="M13.5 9 L20.5 9 M11.5 13 L22.5 13" fill="none" stroke={c} strokeWidth="0.9" />
      <path d="M17 15 L17 37" fill="none" stroke={c} strokeWidth="1.1" />
      <path d="M11.5 18 C 13.5 22, 13.5 27, 11.5 31 M22.5 18 C 20.5 22, 20.5 27, 22.5 31" fill="none" stroke={c} strokeWidth="0.9" />
    </g>
  );
}

const OM_FONT = 'var(--font-yatra), "Noto Sans Devanagari", serif';

/** Drawn on a 280 x 100 canvas with every mark inside x 80..200, so the viewBox
 *  crops to that and the logo fills whatever box holds it: the figure slot,
 *  until (or unless) the owner's artwork for this deity arrives. */
export function DeityLogo({ motif, c, c2 }: Ink & { motif: Motif }) {
  return (
    <svg aria-hidden="true" width="100%" height="100%" viewBox="80 0 120 100">
      {motif === 'ganesh' && (
        <g transform="translate(80,0)">
          <GaneshaFigure c={c} c2={c2} />
        </g>
      )}
      {motif === 'om' && (
        <g>
          <text x="140" y="76" textAnchor="middle" fontFamily={OM_FONT} fontSize="78" fill={c}>
            ॐ
          </text>
          <path d="M104 90 Q122 80 140 90 Q158 80 176 90" fill="none" stroke={c2} strokeWidth="2" />
          <path d="M140 92 C 132 84, 132 78, 140 72 C 148 78, 148 84, 140 92 Z" fill={c2} fillOpacity="0.5" />
        </g>
      )}
      {motif === 'krishna' && (
        <g transform="translate(80,0)" strokeLinecap="round">
          <path d="M60 46 L60 14" stroke="#1E6E5C" strokeWidth="1.8" />
          {KRISHNA_BARBS.map((b, i) => (
            <line key={i} x1={b.x1} y1={b.y1 - 10} x2={b.x2} y2={b.y2 - 10} stroke="#1E6E5C" strokeWidth="1.2" strokeOpacity="0.8" />
          ))}
          <ellipse cx="60" cy="10" rx="9" ry="13" fill="#1E6E5C" />
          <ellipse cx="60" cy="11" rx="5.5" ry="8" fill={c2} />
          <ellipse cx="60" cy="12" rx="2.6" ry="4" fill={c} />
          <path d="M42 54 Q60 40 78 54 L78 60 Q60 48 42 60 Z" fill={c2} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M14 76 L106 76" stroke="#6B4423" strokeWidth="6" />
          <rect x="18" y="72" width="4" height="8" fill={c2} />
          <rect x="98" y="72" width="4" height="8" fill={c2} />
          <circle cx="32" cy="76" r="1.7" fill="#F3E2B8" />
          <circle cx="62" cy="76" r="1.6" fill="#F3E2B8" />
          <circle cx="72" cy="76" r="1.6" fill="#F3E2B8" />
          <circle cx="82" cy="76" r="1.6" fill="#F3E2B8" />
          <circle cx="92" cy="76" r="1.6" fill="#F3E2B8" />
          <path d="M24 79 Q19 88 25 95" fill="none" stroke={c2} strokeWidth="1.6" />
          <path d="M25 93 L21 100 L29 100 Z" fill={c} />
        </g>
      )}
      {motif === 'shiv' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M34 24 A26 26 0 0 0 86 24 A24 18 0 0 1 34 24 Z" fill={c2} fillOpacity="0.8" />
          <path d="M60 96 L60 30" stroke={c} strokeWidth="3.4" />
          <circle cx="60" cy="45" r="3.6" fill="#B3261E" />
          <path d="M60 4 L65 30 L55 30 Z" fill={c} />
          <path d="M60 40 C 42 40, 36 28, 40 10 L45 22 C 46 30, 52 34, 60 34" fill={c} />
          <path d="M60 40 C 78 40, 84 28, 80 10 L75 22 C 74 30, 68 34, 60 34" fill={c} />
          <path d="M49 54 L71 54 L60 63 L71 72 L49 72 L60 63 Z" fill={c2} />
          <path d="M49 63 Q42 60 40 66" fill="none" stroke={c2} strokeWidth="1.4" />
          <circle cx="39" cy="67" r="2.6" fill={c2} />
          <path d="M71 63 Q78 66 80 72" fill="none" stroke={c2} strokeWidth="1.4" />
          <circle cx="81" cy="73" r="2.6" fill={c2} />
        </g>
      )}
      {motif === 'lakshmi' && (
        <g transform="translate(80,0)">
          <circle cx="60" cy="13" r="7.5" fill={c2} />
          <circle cx="60" cy="13" r="3.6" fill="none" stroke={c} strokeWidth="1.2" />
          <path d="M60 88 C 34 88, 20 74, 18 60 C 34 62, 50 72, 60 88 Z" fill={c} fillOpacity="0.5" />
          <path d="M60 88 C 86 88, 100 74, 102 60 C 86 62, 70 72, 60 88 Z" fill={c} fillOpacity="0.5" />
          <path d="M60 88 C 42 80, 34 62, 38 44 C 50 54, 58 70, 60 88 Z" fill={c} fillOpacity="0.78" />
          <path d="M60 88 C 78 80, 86 62, 82 44 C 70 54, 62 70, 60 88 Z" fill={c} fillOpacity="0.78" />
          <path d="M60 88 C 50 72, 50 46, 60 28 C 70 46, 70 72, 60 88 Z" fill={c} />
          <path d="M30 93 Q60 99 90 93" fill="none" stroke={c2} strokeWidth="2" />
        </g>
      )}
      {motif === 'ram' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="62" cy="50" r="30" fill={c2} fillOpacity="0.22" />
          <path d="M40 10 Q 96 50 40 90" fill="none" stroke={c} strokeWidth="3.6" />
          <path d="M40 10 L40 90" stroke={c} strokeWidth="1.2" />
          <path d="M24 50 L100 50" stroke={c} strokeWidth="2.4" />
          <path d="M108 50 L96 43 L99 50 L96 57 Z" fill={c} />
          <path d="M24 50 L17 43 M24 50 L17 57 M30 50 L23 43 M30 50 L23 57" stroke={c2} strokeWidth="2" />
        </g>
      )}
      {motif === 'hanuman' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 96 L24 22" stroke={c} strokeWidth="2" />
          <path d="M24 22 L42 28 L24 34 Z" fill={c2} />
          <g transform="translate(70 52) scale(1.15) translate(-70 -52)">
            <path d="M70 96 L70 50" stroke={c} strokeWidth="5" />
            <rect x="66" y="66" width="8" height="7" fill={c2} />
            <ellipse cx="70" cy="32" rx="17" ry="19" fill={c} />
            <path d="M63 15 Q58 32 63 49 M70 13 L70 51 M77 15 Q82 32 77 49" fill="none" stroke={c2} strokeWidth="1.4" />
            <circle cx="70" cy="10" r="4" fill={c2} />
            <rect x="63" y="49" width="14" height="5" fill={c2} />
          </g>
        </g>
      )}
      {motif === 'saraswati' && (
        <g transform="translate(80,0)" strokeLinecap="round">
          <path d="M26 92 Q60 84 94 92" fill="none" stroke={c2} strokeWidth="2" />
          <path d="M26 80 L100 20" stroke="#7A4B22" strokeWidth="5" />
          <path d="M31 78 L99 23 M28 75 L96 20" stroke={c2} strokeWidth="0.9" />
          {FRETS.map((f, i) => (
            <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} stroke={c} strokeWidth="1.6" />
          ))}
          <circle cx="30" cy="76" r="17" fill={c2} />
          <circle cx="30" cy="76" r="11" fill="none" stroke={c} strokeWidth="1.5" />
          <circle cx="92" cy="28" r="9" fill={c2} fillOpacity="0.85" />
          <path d="M100 20 Q108 12 104 6" fill="none" stroke="#7A4B22" strokeWidth="3" />
          <path
            d="M70 92 C 63 92, 58 88, 58 84 C 66 86, 74 84, 78 78 C 81 72, 78 66, 82 62 C 86 59, 91 62, 89 66 L95 66 L89 68 C 86 72, 88 78, 86 84 C 84 90, 78 92, 70 92 Z"
            fill={c}
            fillOpacity="0.9"
          />
          <circle cx="86" cy="64" r="0.9" fill="#FFFFFF" />
        </g>
      )}
      {motif === 'mahadev' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          {/* The naag's hood fans wider than the linga and is marked only with
              scale chevrons: no arc or dots on it, which read as a face. */}
          <path d="M60 2 C 44 2, 33 12, 33 24 C 33 32, 40 38, 50 42 L70 42 C 80 38, 87 32, 87 24 C 87 12, 76 2, 60 2 Z" fill={c2} fillOpacity="0.9" />
          <path d="M60 7 L60 38 M51 13 L60 18 L69 13 M48 21 L60 26 L72 21 M50 29 L60 34 L70 29" fill="none" stroke={c} strokeWidth="1.1" strokeOpacity="0.6" />
          <path d="M18 80 C 18 72, 102 72, 102 80 C 102 88, 18 88, 18 80 Z" fill={c2} fillOpacity="0.85" />
          <path d="M100 78 L117 81 L100 86 Z" fill={c2} />
          <path d="M44 76 L44 42 C 44 24, 76 24, 76 42 L76 76 Z" fill={c} />
          <path d="M48 40 L72 40 M47 46 L73 46 M47 52 L73 52" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="2.2" />
          <circle cx="60" cy="46" r="2.2" fill="#B3261E" />
          <path d="M42 66 C 50 73, 70 73, 78 66" fill="none" stroke={c2} strokeWidth="3.2" />
          <path d="M78 66 C 84 70, 84 76, 79 79" fill="none" stroke={c2} strokeWidth="2.4" />
          <path d="M10 92 L110 92" stroke={c2} strokeWidth="1.5" />
        </g>
      )}
      {motif === 'durga' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 26 C 30 6, 90 6, 94 26 Z" fill={c2} fillOpacity="0.9" />
          <path d="M60 4 L60 9" stroke={c} strokeWidth="2" />
          {[30, 42, 54, 66, 78, 90].map((x) => (
            <circle key={x} cx={x} cy="29" r="2.2" fill={c} />
          ))}
          <path d="M28 64 C 18 60, 15 50, 21 45" fill="none" stroke={c} strokeWidth="2.4" />
          <circle cx="21" cy="44" r="2.8" fill={c} />
          <ellipse cx="54" cy="68" rx="27" ry="12" fill={c} />
          <rect x="32" y="72" width="6" height="18" rx="2" fill={c} />
          <rect x="44" y="74" width="6" height="16" rx="2" fill={c} />
          <rect x="62" y="74" width="6" height="16" rx="2" fill={c} />
          <rect x="72" y="72" width="6" height="18" rx="2" fill={c} />
          <circle cx="82" cy="56" r="15" fill={c} fillOpacity="0.45" />
          <circle cx="86" cy="56" r="8.5" fill={c} />
          <circle cx="81" cy="47" r="2.6" fill={c} />
          <circle cx="89" cy="54" r="1.3" fill={c2} />
          <path d="M93 57 L99 59.5 L93 62 Z" fill={c} />
          <path d="M12 92 L108 92" stroke={c2} strokeWidth="1.5" />
        </g>
      )}
      {motif === 'ambabai' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="60" cy="9" r="4.5" fill="#B3261E" />
          <path d="M50 17 Q60 23 70 17" fill="none" stroke={c} strokeWidth="2" />
          {[44, 60, 76].map((x) => (
            <path key={x} d="M0 0 C -3 -4, -2 -9, 0 -13 C 2 -9, 3 -4, 0 0 Z" transform={`translate(${x} 39)`} fill="#B3261E" fillOpacity="0.85" />
          ))}
          <path d="M36 40 C 41 47, 79 47, 84 40 Z" fill={c2} />
          <rect x="57" y="44" width="6" height="44" fill={c2} />
          <ellipse cx="60" cy="54" rx="7" ry="2.6" fill={c2} />
          <ellipse cx="60" cy="68" rx="8" ry="2.8" fill={c2} />
          <path d="M40 92 C 40 85, 80 85, 80 92 Z" fill={c2} />
          <path d="M57 54 L63 54 M57 68 L63 68" stroke={c} strokeWidth="1" />
          <path d="M30 94 L90 94" stroke={c} strokeWidth="1.5" />
        </g>
      )}
      {motif === 'vitthal' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          {[46, 74].map((x) => (
            <g key={x} transform={`translate(${x} 60)`}>
              <path d="M0 0 C -7 0, -9 -12, -8 -24 C -7 -33, 7 -33, 8 -24 C 9 -12, 7 0, 0 0 Z" fill={c} />
              {[-5, -2.5, 0, 2.5, 5].map((dx, i) => (
                <circle key={dx} cx={dx} cy={i === 2 ? -38 : i % 4 === 0 ? -35 : -37} r={i === 2 ? 2 : 1.6} fill={c} />
              ))}
            </g>
          ))}
          <rect x="22" y="62" width="76" height="22" rx="2" fill={c2} fillOpacity="0.85" />
          <rect x="25" y="65" width="70" height="16" rx="1.5" fill="none" stroke={c} strokeWidth="1" />
          {[12, 108].map((x) => (
            <g key={x}>
              <path d={`M${x} 84 C ${x} 70, ${x + (x < 60 ? 2 : -2)} 58, ${x + (x < 60 ? 4 : -4)} 48`} fill="none" stroke={LEAF} strokeWidth="1.6" />
              {[78, 70, 62, 54].map((y, i) => (
                <ellipse key={y} cx={x + (i % 2 ? 4 : -4)} cy={y} rx="3.4" ry="2" fill={LEAF} transform={`rotate(${i % 2 ? -30 : 30} ${x + (i % 2 ? 4 : -4)} ${y})`} />
              ))}
            </g>
          ))}
          <path d="M14 90 L106 90" stroke={c} strokeWidth="1.5" />
        </g>
      )}
      {motif === 'balaji' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M44 18 L44 58 C 44 82, 76 82, 76 58 L76 18 L68 18 L68 57 C 68 70, 52 70, 52 57 L52 18 Z" fill={c2} />
          <rect x="57" y="28" width="6" height="50" rx="3" fill={c} />
          <g transform="translate(-1.8 15.2) scale(1.4)">
            <Shankh c={c} />
          </g>
          <circle cx="100" cy="46" r="13" fill="none" stroke={c2} strokeWidth="2.4" />
          <circle cx="100" cy="46" r="4" fill={c2} />
          {rot(8).map((a) => (
            <path key={a} d="M100 42 L100 33" stroke={c2} strokeWidth="1.4" transform={`rotate(${a} 100 46)`} />
          ))}
          {rot(8, 22.5).map((a) => (
            <circle key={a} cx="100" cy="30" r="1.4" fill={c} transform={`rotate(${a} 100 46)`} />
          ))}
          <path d="M10 90 L110 90" stroke={c2} strokeWidth="1.5" />
        </g>
      )}
      {motif === 'khandoba' && (
        <g transform="translate(80,0)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 90 C 28 66, 92 66, 100 90 Z" fill={c2} />
          {[[44, 80], [58, 74], [72, 81], [86, 84], [34, 85]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill={c} fillOpacity="0.45" />
          ))}
          <circle cx="60" cy="44" r="22" fill={c} fillOpacity="0.85" />
          <circle cx="60" cy="44" r="17" fill="none" stroke={c2} strokeWidth="1.4" />
          {[[52, 36], [68, 36], [52, 52], [68, 52]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill={c2} />
          ))}
          <circle cx="60" cy="44" r="3" fill={c2} />
          <path d="M26 12 C 50 30, 70 50, 90 76 L86 78 C 66 52, 46 32, 22 16 Z" fill={c2} stroke={c} strokeWidth="1" />
          <path d="M16 22 L30 8" stroke={c} strokeWidth="3" />
          <path d="M21 13 L14 6" stroke={c} strokeWidth="3" />
          <circle cx="12.5" cy="4.5" r="2.6" fill={c} />
        </g>
      )}
    </svg>
  );
}

const LEAF = '#5E8C4A';
const FEATHER = '#1E6E5C';
const WOOD = '#7A4B22';

/** Something small at y, drawn twice more at y +- 88 so a connector that sits
 *  on the repeat seam shows as one whole shape across two tiles. */
function seam(y: number, draw: (y: number) => React.ReactNode) {
  return [y - 88, y, y + 88].map((v) => <g key={v}>{draw(v)}</g>);
}

/**
 * One repeat of a side band: 34 wide by 88 tall, upright, x = 0 at the paper
 * edge. Motif A sits in the top 44px slot, motif B in the bottom one. The right
 * band is this mirrored, so nothing here may be text.
 * Peacock feathers are Krishna's alone, and never crossed with a flute.
 */
export function DeityBand({ motif, c, c2 }: Ink & { motif: Motif }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {motif === 'ganesh' && (
        <>
          <path d="M17 0 C 27 11, 27 33, 17 44 C 7 55, 7 77, 17 88" fill="none" stroke={LEAF} strokeWidth="1.2" />
          <path d="M24 34 C 29 33, 31 36, 30 39 C 27 39, 24 37, 24 34 Z" fill={LEAF} />
          <path d="M10 78 C 5 77, 3 80, 4 83 C 7 83, 10 81, 10 78 Z" fill={LEAF} />
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={17 + 6 * Math.sin((i * Math.PI) / 5)} cy={22 - 6 * Math.cos((i * Math.PI) / 5)} r="3" fill={c2} />
          ))}
          <circle cx="17" cy="22" r="3.6" fill={c} />
          <path d="M17 56 C 13 62, 9 68, 10 72 C 11 76, 23 76, 24 72 C 25 68, 21 62, 17 56 Z" fill={c2} fillOpacity="0.85" stroke={c} strokeWidth="1" />
          <path d="M17 58 L17 75 M13.5 64 Q14 70 13 75 M20.5 64 Q20 70 21 75" fill="none" stroke={c} strokeWidth="0.8" />
        </>
      )}
      {motif === 'ram' && (
        <>
          <path d="M11 8 Q 31 22 11 36" fill="none" stroke={c} strokeWidth="2.4" />
          <path d="M11 8 L11 36" stroke={c2} strokeWidth="1" />
          <path d="M11 8 q -3 -2 -2 -5 M11 36 q -3 2 -2 5" fill="none" stroke={c} strokeWidth="1.4" />
          <path d="M7 74 L7 62 L11.5 67 L17 56 L22.5 67 L27 62 L27 74 Z" fill={c2} fillOpacity="0.9" stroke={c} strokeWidth="1.2" />
          <path d="M6 75 L28 75" stroke={c} strokeWidth="2" />
          <circle cx="17" cy="61" r="1.6" fill={c} />
          <circle cx="17" cy="70" r="1.5" fill={c} />
          {seam(44, (y) => <path d={`M17 ${y - 3} L19.5 ${y} L17 ${y + 3} L14.5 ${y} Z`} fill={c2} />)}
        </>
      )}
      {motif === 'shiv' && (
        <>
          <path d="M17 0 L17 88" stroke={c2} strokeWidth="0.8" />
          <path d="M17 38 L17 12" stroke={c} strokeWidth="2" />
          <path d="M17 4 L19.5 13 L14.5 13 Z" fill={c} />
          <path d="M17 17 C 10 17, 8 12, 9 6 L11.5 11 C 12 14, 14 15, 17 15 Z" fill={c} />
          <path d="M17 17 C 24 17, 26 12, 25 6 L22.5 11 C 22 14, 20 15, 17 15 Z" fill={c} />
          <path d="M10 57 L24 57 L17 66 L24 75 L10 75 L17 66 Z" fill={c2} />
          <path d="M10 57 L24 57 M10 75 L24 75" stroke={c} strokeWidth="1.4" />
          <path d="M13.5 66 Q8 66 7 69.5 M20.5 66 Q26 66 27 69.5" fill="none" stroke={c2} strokeWidth="0.9" />
          <circle cx="7" cy="70.5" r="1.4" fill={c2} />
          <circle cx="27" cy="70.5" r="1.4" fill={c2} />
          {seam(44, (y) => (
            <>
              <circle cx="17" cy={y} r="3.2" fill={c} fillOpacity="0.85" />
              <circle cx="17" cy={y} r="1" fill={c2} />
            </>
          ))}
        </>
      )}
      {motif === 'lakshmi' && (
        <>
          <path d="M17 34 C 12 26, 13 15, 17 8 C 21 15, 22 26, 17 34 Z" fill={c} />
          <path d="M17 34 C 9 31, 6 24, 7 17 C 13 20, 16 27, 17 34 Z" fill={c} fillOpacity="0.7" />
          <path d="M17 34 C 25 31, 28 24, 27 17 C 21 20, 18 27, 17 34 Z" fill={c} fillOpacity="0.7" />
          <path d="M9 37 Q17 40 25 37" fill="none" stroke={c2} strokeWidth="1.4" />
          <circle cx="17" cy="66" r="7.5" fill={c2} />
          <circle cx="17" cy="66" r="3.5" fill="none" stroke={c} strokeWidth="1.2" />
          {seam(44, (y) => <circle cx="17" cy={y} r="1.5" fill={c2} />)}
        </>
      )}
      {motif === 'hanuman' && (
        <>
          <path d="M17 38 L17 22" stroke={c} strokeWidth="2.6" />
          <ellipse cx="17" cy="15" rx="7" ry="8" fill={c} />
          <path d="M13 9 Q11 15 13 21 M17 7 L17 23 M21 9 Q23 15 21 21" fill="none" stroke={c2} strokeWidth="0.9" />
          <circle cx="17" cy="6" r="1.8" fill={c2} />
          <rect x="13.5" y="22" width="7" height="2.5" fill={c2} />
          <path d="M5 76 L13 60 L17 66 L22 56 L29 76 Z" fill={c2} fillOpacity="0.85" />
          <path d="M22 56 L19.5 61 M22 56 L24.5 62" fill="none" stroke={c} strokeWidth="1" />
          <path d="M5 76 L29 76" stroke={c} strokeWidth="1.4" />
          {seam(44, (y) => <circle cx="17" cy={y} r="1.6" fill={c} />)}
        </>
      )}
      {motif === 'saraswati' && (
        <>
          <path d="M17 6 L17 36" stroke={WOOD} strokeWidth="2.4" />
          <circle cx="17" cy="33" r="6" fill={c2} />
          <circle cx="17" cy="33" r="3.6" fill="none" stroke={c} strokeWidth="1" />
          <circle cx="17" cy="9" r="3.5" fill={c2} fillOpacity="0.85" />
          <path d="M15 15 L19 15 M15 19 L19 19 M15 23 L19 23 M15 27 L19 27" stroke={c} strokeWidth="1" />
          <path
            d="M5 72 C 10 68, 14 69, 17 72 C 20 69, 24 68, 29 72 L29 60 C 24 56, 20 57, 17 60 C 14 57, 10 56, 5 60 Z"
            fill={c2}
            fillOpacity="0.5"
            stroke={c}
            strokeWidth="1.2"
          />
          <path d="M17 60 L17 72" stroke={c} strokeWidth="1" />
          <path d="M8 62 C 11 60, 14 61, 16 63 M18 63 C 20 61, 23 60, 26 62" fill="none" stroke={c} strokeWidth="0.7" />
          {seam(44, (y) => (
            <path d={`M17 ${y + 5} C 14 ${y + 2}, 14 ${y - 2}, 17 ${y - 5} C 20 ${y - 2}, 20 ${y + 2}, 17 ${y + 5} Z`} fill={c} fillOpacity="0.8" />
          ))}
        </>
      )}
      {motif === 'krishna' && (
        <>
          <path d="M17 38 L17 14" stroke={FEATHER} strokeWidth="1.2" />
          {[18, 22, 26, 30, 34].map((y) => (
            <path key={y} d={`M17 ${y} L11 ${y - 4} M17 ${y} L23 ${y - 4}`} stroke={FEATHER} strokeWidth="0.8" strokeOpacity="0.8" />
          ))}
          <ellipse cx="17" cy="11" rx="5.5" ry="7.5" fill={FEATHER} />
          <ellipse cx="17" cy="11.5" rx="3.3" ry="4.6" fill={c2} />
          <ellipse cx="17" cy="12" rx="1.6" ry="2.3" fill={c} />
          <circle cx="17" cy="66" r="6.5" fill={c2} />
          <circle cx="17" cy="66" r="9.5" fill="none" stroke={c} strokeWidth="0.9" strokeDasharray="1.5 2.5" />
          {seam(44, (y) => <circle cx="17" cy={y} r="1.5" fill={c} />)}
        </>
      )}
      {motif === 'om' && (
        <>
          <path d="M17 0 L17 88" stroke={c2} strokeWidth="0.8" />
          {[-50, -25, 0, 25, 50].map((a) => (
            <path
              key={a}
              d="M0 0 C 3 -6, 3 -14, 0 -20 C -3 -14, -3 -6, 0 0 Z"
              transform={`translate(17 36) rotate(${a})`}
              fill={c}
              fillOpacity="0.35"
              stroke={c}
              strokeWidth="0.9"
            />
          ))}
          <circle cx="17" cy="66" r="4" fill={c2} />
          <circle cx="17" cy="58" r="1.8" fill={c} />
          <circle cx="17" cy="74" r="1.8" fill={c} />
        </>
      )}
      {motif === 'mahadev' && (
        <>
          <ellipse cx="17" cy="35" rx="10" ry="4" fill={c2} fillOpacity="0.4" stroke={c} strokeWidth="1.3" />
          <ellipse cx="17" cy="29" rx="8" ry="3.4" fill={c2} fillOpacity="0.4" stroke={c} strokeWidth="1.3" />
          <path d="M19 27 C 20 21, 15 19, 15 14" fill="none" stroke={c} strokeWidth="2.4" />
          <ellipse cx="15" cy="9" rx="5" ry="6.5" fill={c} />
          <path d="M13 7 L15 11 L17 7" fill="none" stroke={c2} strokeWidth="0.9" />
          <path d="M17 54 C 23 60, 23 72, 17 78 C 11 72, 11 60, 17 54 Z" fill={c2} fillOpacity="0.35" stroke={c} strokeWidth="1.4" />
          <circle cx="17" cy="66" r="3.4" fill={c} />
          <circle cx="17" cy="66" r="1" fill={c2} />
          <circle cx="17" cy="44" r="1.5" fill={c2} />
        </>
      )}
      {motif === 'durga' && (
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M17 22 C 11 17, 11 10, 17 8 C 23 10, 23 17, 17 22 Z" transform={`rotate(${a} 17 22)`} fill={c} fillOpacity="0.85" />
          ))}
          <path d="M17 22 L24 12" stroke={c2} strokeWidth="1.2" />
          <circle cx="24" cy="12" r="1.3" fill={c2} />
          <circle cx="17" cy="22" r="2" fill={c2} />
          <path d="M17 52 L17 58" stroke={c} strokeWidth="1.6" />
          <circle cx="17" cy="51" r="1.6" fill={c} />
          <path d="M10 74 C 10 64, 12 58, 17 58 C 22 58, 24 64, 24 74 Z" fill={c2} fillOpacity="0.85" stroke={c} strokeWidth="1.2" />
          <path d="M8 74 L26 74" stroke={c} strokeWidth="1.8" />
          <circle cx="17" cy="77.5" r="1.8" fill={c} />
          <circle cx="17" cy="44" r="1.5" fill={c2} />
        </>
      )}
      {motif === 'ambabai' && (
        <>
          {[12, 18, 24, 30].map((y, i) => (
            <ellipse key={y} cx="17" cy={y} rx="11" ry="3.2" fill="none" stroke={i === 1 ? c2 : c} strokeWidth="2" />
          ))}
          <path d="M9 70 C 7 60, 15 54, 25 57" fill="none" stroke={c2} strokeWidth="2.2" />
          {[[9, 70], [8, 65], [10, 60], [14, 56.5], [19, 55.5]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={c2} />
          ))}
          <circle cx="13" cy="64" r="3" fill={c} />
          <circle cx="13" cy="64" r="1.4" fill="#B3261E" />
          <path d="M25 57 L27 63" stroke={c2} strokeWidth="1" />
          <circle cx="27" cy="64.5" r="1.6" fill={c2} />
          <circle cx="17" cy="44" r="1.5" fill={c2} />
        </>
      )}
      {motif === 'vitthal' && (
        <>
          <path d="M17 26 L17 8" stroke={LEAF} strokeWidth="1.4" />
          {[[13, 21, 30], [21, 17, -30], [13, 13, 30], [21, 10, -30]].map(([x, y, a]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="3" ry="1.8" fill={LEAF} transform={`rotate(${a} ${x} ${y})`} />
          ))}
          <circle cx="17" cy="6" r="1.4" fill={LEAF} />
          <path d="M8 40 L26 40 L24 26 L10 26 Z" fill={c2} fillOpacity="0.85" stroke={c} strokeWidth="1" />
          <path d="M7 26 L27 26" stroke={c} strokeWidth="1.6" />
          <path d="M17 30 L20 33 L17 36 L14 33 Z" fill={c} />
          <path d="M10 84 L10 50" stroke={c} strokeWidth="1.8" />
          <circle cx="10" cy="49" r="1.6" fill={c} />
          <path d="M10 51 L28 57 L10 63 Z" fill={c2} />
          <circle cx="17" cy="44" r="1.5" fill={c2} />
        </>
      )}
      {motif === 'balaji' && (
        <>
          <Shankh c={c} />
          <circle cx="17" cy="66" r="10" fill="none" stroke={c} strokeWidth="1.8" />
          <circle cx="17" cy="66" r="2.6" fill={c} />
          {rot(8).map((a) => (
            <path key={a} d="M17 63.4 L17 56" stroke={c} strokeWidth="1" transform={`rotate(${a} 17 66)`} />
          ))}
          {rot(8, 22.5).map((a) => (
            <circle key={a} cx="17" cy="53.5" r="0.9" fill={c2} transform={`rotate(${a} 17 66)`} />
          ))}
          <circle cx="17" cy="44" r="1.5" fill={c2} />
        </>
      )}
      {motif === 'khandoba' && (
        <>
          <path d="M11 40 L23 40 L19.5 7 L14.5 7 Z" fill={c2} fillOpacity="0.85" stroke={c} strokeWidth="1" />
          {[[12, 2.4], [18, 3.2], [24, 4], [30, 4.8], [36, 5.6]].map(([y, h]) => (
            <path key={y} d={`M${17 - h} ${y} L${17 + h} ${y}`} stroke={c} strokeWidth="1.6" />
          ))}
          <path d="M17 7 C 15.5 5, 16 3, 17 1.5 C 18 3, 18.5 5, 17 7 Z" fill={c} />
          <circle cx="17" cy="66" r="10" fill={c} fillOpacity="0.85" />
          <circle cx="17" cy="66" r="7.5" fill="none" stroke={c2} strokeWidth="1" />
          {[[13, 62], [21, 62], [13, 70], [21, 70]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill={c2} />
          ))}
          <circle cx="17" cy="66" r="1.6" fill={c2} />
          <circle cx="17" cy="44" r="1.5" fill={c2} />
        </>
      )}
    </g>
  );
}

/** The corner piece every devotional theme shares: a paper disc that covers the
 *  rule corners, eight petals and a gold centre. */
export function Rosette({ cx, cy, r, c, c2, paper }: Ink & { cx: number; cy: number; r: number; paper: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={paper} />
      {rot(8).map((a) => (
        <ellipse
          key={a}
          cx={cx}
          cy={r2(cy - 0.55 * r)}
          rx={r2(0.22 * r)}
          ry={r2(0.45 * r)}
          fill={c}
          fillOpacity="0.8"
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r2(0.28 * r)} fill={c2} />
    </g>
  );
}

/**
 * One watermark symbol in a 44 x 44 box, repeated in a half-drop grid behind
 * the details at the theme's tileOpacity. One ink is enough: the opacity does
 * the rest, and a single colour prints evenly on a home inkjet.
 */
export function DeityTile({ motif, c }: Ink & { motif: Motif }) {
  return (
    <g fill={c} stroke={c} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0">
      {motif === 'ganesh' && (
        <>
          <path d="M22 6 C 15 15, 8 25, 9 31 C 10 38, 34 38, 35 31 C 36 25, 29 15, 22 6 Z" fillOpacity="0.6" />
          <path d="M22 9 L22 37 M15.5 20 Q16 29 14.5 36 M28.5 20 Q28 29 29.5 36" fill="none" strokeWidth="1.3" />
        </>
      )}
      {motif === 'ram' && (
        <>
          <circle cx="22" cy="22" r="8" />
          {rot(12).map((a, i) => (
            <path key={a} d={`M22 ${i % 2 ? 9 : 6} L22 12`} strokeWidth="2" transform={`rotate(${a} 22 22)`} />
          ))}
        </>
      )}
      {motif === 'shiv' && (
        <>
          {[-55, 0, 55].map((a) => (
            <path key={a} d="M0 0 C -6 -6, -6 -14, 0 -19 C 6 -14, 6 -6, 0 0 Z" transform={`translate(22 28) rotate(${a})`} />
          ))}
          <path d="M22 28 L22 40" strokeWidth="1.6" />
        </>
      )}
      {motif === 'lakshmi' && (
        <>
          <path d="M22 38 C 16 29, 17 15, 22 6 C 27 15, 28 29, 22 38 Z" />
          <path d="M22 38 C 12 35, 7 26, 8 18 C 16 21, 20 30, 22 38 Z" fillOpacity="0.7" />
          <path d="M22 38 C 32 35, 37 26, 36 18 C 28 21, 24 30, 22 38 Z" fillOpacity="0.7" />
        </>
      )}
      {motif === 'hanuman' && (
        <>
          <path d="M22 41 L22 22" strokeWidth="3" />
          <ellipse cx="22" cy="14" rx="8" ry="9.5" />
          <circle cx="22" cy="3.5" r="2.2" />
          <rect x="17.5" y="22.5" width="9" height="3" />
        </>
      )}
      {motif === 'saraswati' && (
        <>
          <path
            d="M4 32 C 11 27, 17 28, 22 32 C 27 28, 33 27, 40 32 L40 15 C 33 10, 27 11, 22 15 C 17 11, 11 10, 4 15 Z"
            fillOpacity="0.55"
            strokeWidth="1.4"
          />
          <path d="M22 15 L22 32" strokeWidth="1.4" />
        </>
      )}
      {motif === 'krishna' && (
        <>
          <path d="M17 12 C 18 7, 26 7, 27 12 Z" fillOpacity="0.5" />
          <path d="M14 12 L30 12" strokeWidth="2.4" />
          <path d="M15 19 L29 19 L27 13 L17 13 Z" fillOpacity="0.8" />
          <path d="M10 22 C 6 30, 10 38, 22 38 C 34 38, 38 30, 34 22 C 31 18, 13 18, 10 22 Z" fillOpacity="0.75" />
          <path d="M9.5 27 Q22 31 34.5 27" fill="none" strokeWidth="1.6" />
        </>
      )}
      {motif === 'om' && (
        <>
          <path d="M22 26 C 17 20, 19 13, 22 6 C 25 13, 27 20, 22 26 Z" fillOpacity="0.6" />
          <path d="M22 24 C 20 21, 21 17, 22 13 C 23 17, 24 21, 22 24 Z" />
          <path d="M6 28 C 10 37, 34 37, 38 28 Z" />
          <path d="M18 37 L26 37 L28 40 L16 40 Z" />
        </>
      )}
      {motif === 'mahadev' && (
        <>
          <path d="M5 36 C 5 27, 12 23, 22 23 C 28 23, 31 21, 32 18 L 37 18 C 39 23, 38 30, 35 33 L 35 36 Z" />
          <path d="M14 24 C 15 18, 22 17, 24 23 Z" />
          <ellipse cx="36" cy="15" rx="4.5" ry="6" transform="rotate(20 36 15)" />
          <path d="M33 10 C 31 7, 32 5, 34 4 M39 10 C 40 7, 39 5, 37 4" fill="none" strokeWidth="1.6" />
          <path d="M40 13 L44 12 L40 16 Z" />
          <path d="M3 38 L41 38" fill="none" strokeWidth="1.2" />
        </>
      )}
      {motif === 'durga' && (
        <>
          {[-60, -30, 0, 30, 60].map((a) => (
            <path key={a} d="M0 0 C 3 -3, 3 -8, 0 -11 C -3 -8, -3 -3, 0 0 Z" transform={`translate(22 21) rotate(${a})`} fillOpacity="0.6" />
          ))}
          <ellipse cx="22" cy="11" rx="5" ry="6" />
          <path d="M15 26 L29 26 L27 21 L17 21 Z" fillOpacity="0.85" />
          <path d="M12 26 C 6 32, 10 42, 22 42 C 34 42, 38 32, 32 26 Z" fillOpacity="0.75" />
          <path d="M10 33 Q22 37 34 33" fill="none" strokeWidth="1.4" />
        </>
      )}
      {motif === 'ambabai' && (
        <>
          <path d="M10 26 L34 26 L32 40 L12 40 Z" fillOpacity="0.8" />
          <path d="M8 26 C 9 16, 35 16, 36 26 Z" />
          <circle cx="22" cy="12" r="3" />
          <path d="M7 26 L37 26" fill="none" strokeWidth="1.6" />
          <path d="M11 33 L33 33" fill="none" strokeWidth="1" />
        </>
      )}
      {motif === 'vitthal' && (
        <>
          <path d="M12 15 C 16 6, 28 8, 32 19" fill="none" strokeWidth="1.2" />
          <path d="M4 26 C 4 18, 20 18, 20 26 Z" />
          <path d="M2 26 L22 26" fill="none" strokeWidth="1.6" />
          <circle cx="12" cy="16.5" r="2" />
          <path d="M24 32 C 24 24, 40 24, 40 32 Z" />
          <path d="M22 32 L42 32" fill="none" strokeWidth="1.6" />
          <circle cx="32" cy="22.5" r="2" />
        </>
      )}
      {motif === 'balaji' && (
        <>
          <path d="M12 6 L12 26 C 12 42, 32 42, 32 26 L32 6 L27 6 L27 25 C 27 34, 17 34, 17 25 L17 6 Z" fillOpacity="0.7" />
          <rect x="20" y="12" width="4" height="26" rx="2" />
        </>
      )}
      {motif === 'khandoba' && (
        <>
          <path d="M10 28 C 14 14, 30 14, 34 28 Z" fillOpacity="0.55" />
          <path d="M6 28 C 8 40, 36 40, 38 28 Z" />
          <path d="M5 28 L39 28" fill="none" strokeWidth="1.6" />
          <path d="M18 39 L26 39 L27 42 L17 42 Z" />
        </>
      )}
    </g>
  );
}
