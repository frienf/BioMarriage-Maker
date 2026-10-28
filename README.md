# Biodata Maker

Print-ready Indian marriage biodata in English, Hindi and Marathi. Pay once per
PDF, no account. Built from scratch against the "Toran" design canvas.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Postgres (only needed for orders, payment and download):

```bash
docker compose up -d postgres
npm run db:push
```

Chromium for PDF rendering: `npm run pdf:install`

## Checks

| Command | What it proves |
|---|---|
| `npm test` | 45 unit tests: age rules, formatting, glyph coverage, money, catalogue, translation parity, devotional frame geometry, deity figure files, invocation glyphs |
| `npm run typecheck` | Clean |
| `npm run lint` | Clean |
| `npm run build` | Clean; 78 template pages prerendered (26 × 3 locales) |
| `npm run proofs` | Prints all 26 templates to `proofs/*.pdf` (dev server must be running) |
| `npm run fit` | Measures every template in every language against A4 with a fully filled biodata. All 26 fit |
| `npm run motion` | Checks the animated moments actually move rather than cut (dev server must be running) |
| `npm run brand` | Verifies the logo reveal and hero background: no flash, no half-drawn strokes, no loop seam, contrast floor. No dev server needed |
| `npm run sweep` | Erases orders past their 14-day retention |

## How it is put together

- **Design tokens** — `src/app/globals.css`. Every colour, size and radius from
  the canvas lives here. Change a token, not a page.
- **Field model** — `src/lib/biodata.ts`. One schema for all templates and
  languages. Cultural fields are all optional. Bride 18 / groom 21 age rule.
- **Sections** — `src/templates/rows.ts`. Turns biodata into printable rows
  once, for all 26 templates. Dates, times, heights and Devanagari numerals
  are formatted here and nowhere else.
- **Templates** — 6 layouts, 26 catalogue entries (`src/templates/catalog.ts`).
  Adding "another traditional design in green" is a row, not a component.
- **Ornaments** — `src/templates/ornaments.tsx`. Eight deity logos, side-band
  units, tile symbols and corner rosettes, drawn from scratch. Where they sit on
  the sheet is `src/templates/devotional-frame.ts`. The market audit's fixes are
  baked in and commented; read them before "tidying" anything there.
- **PDF** — server-rendered by Chromium printing `/print/<token>`, from the
  same React components as the preview (ADR-004: not html2pdf.js, which would
  let anyone produce the paid PDF from devtools and loses selectable text).

### Deliberate simplifications

Two tables, not the seventeen in the Phase 1 design: the catalogue and its
prices are code, and the PDF renders on demand and is cached on disk, so there
is no queue table and no worker. Add the queue when a render makes a request
wait too long; add a price table when prices must change without a deploy. The
price charged is still stored on the order and never recomputed.

Crypto-shredding is not implemented; `sweep` hard-erases instead.

## Page fit

A biodata sheet is a fixed A4 box, so anything past it would be cut from the
PDF rather than flowing onto another page. `npm run fit` renders every template
with a biodata that has every section filled in and fails if any of them
overflows, which makes clipping a build failure instead of something a family
discovers after paying.

The canvas designs were drawn against sparse samples and all but three of them
overflowed once the full field model was wired in, by between 70px and 619px.
They were tightened to fit: smaller measures, smaller section gaps, shorter
label columns. Two guards remain behind that, because a long "about" can still
outgrow a page: the editor warns live, and the review page refuses to take
payment while the sheet overflows.

## Motion

Three places use Motion (`motion/react`), chosen because a page reload or a CSS
transition cannot do them:

- **Gallery filtering** — surviving cards travel to their new positions instead
  of the grid snapping. Filtering is still URL state, so the chips work with
  JavaScript off; the animation is the only thing that needs the client.
  `layout="position"` on purpose: the cards never change size, and animating
  size would scale-correct the A4 preview inside them and distort it.
- **Editor steps** — a short slide in the direction of travel, so going back
  does not look like going on.
- **Order page** — the pending, paid and failed states resolve into each other
  while a payment settles.

A fourth, the colour-swatch crossfade on a template page, is **CSS, not Motion**
(`.crossfade` in globals.css). It was written with Motion first and measured as
a cut: the swap happens inside a React commit that re-reconciles a full A4
sheet, and a frame-loop tween gets swallowed by it. A compositor-driven
`transition: opacity` keeps fading through the commit. That page therefore
carries no Motion at all and its bundle is unchanged.

`MotionProvider` sets `reducedMotion="user"` once for the whole site, so every
transform and layout animation obeys the operating system setting without each
component remembering to ask. That is also why there is no per-component
reduced-motion hook: one mechanism, applied once, rather than two doing the
same job.

Every value a component animates with comes from `src/lib/motion-tokens.ts` —
durations, easings, distances, springs — so changing how the site moves is one
file, not a search for inline numbers. The CSS-driven motion (the colour
crossfade, the hero drift) reads matching custom properties in globals.css, and
`tests/motion-tokens.test.ts` fails if the two sets drift apart.

There is no stagger token and nothing staggers. The lists that would are on
prerendered pages that ship no JavaScript, and staggering them would mean
shipping an animation library in order to delay content someone came to read.

One rule is bent knowingly: the template grid uses `layout` on up to twenty
cards, where the usual advice is to stop at about five. It is `layout="position"`
inside `mode="popLayout"`, so only positions are projected and nothing
scale-corrects the A4 preview inside each card — and `npm run motion` measures
the result settling in about fifteen frames. If that number climbs, swap to
explicit transforms.

## Brand mark

`public/brand/toran-logo.html` is a standalone reveal of the toran mark: open
it in a browser, no build step. One technique throughout — stroke draw-on: the
cord draws, then each leaf and marigold draws its own outline and its fill
settles in behind it, and the wordmark lands last so the eye finishes on the
name. 1.5s end to end, nothing translated or squashed, and the only scale is a
4% overshoot on the final settle.

`?t=N` freezes the reveal at N seconds for a deterministic screenshot. Each
piece carries its own delay, so the harness reads that delay before seeking
rather than overwriting every delay with `-N`, which would flatten the stagger.

```bash
npx playwright screenshot --wait-for-timeout=1200   "file:///C:/path/to/public/brand/toran-logo.html?t=0.75" frame-mid.png
```

`public/brand/toran-logo.svg` is the static final frame, for reduced motion, a
poster, print or a favicon source. The reveal honours
`prefers-reduced-motion` on its own and shows the finished mark with no
movement.

The hero on the home page carries this ambience live: `.hero-bg` and
`.hero-scrim` in globals.css, two decorative layers inside the hero section.
Pure CSS, so it adds no JavaScript to a page that is otherwise fully
prerendered. `npm run motion` measures the live hero and currently reports
**8.59:1** worst-case contrast for the white headline over it.

`public/brand/hero-background.html` keeps the same technique as a standalone
fixture, because a live hero cannot be frozen at `?t=N` for a deterministic
screenshot. The gradient values are therefore written twice on purpose; change
one and run both `npm run brand` and `npm run motion`.

The standalone file: four
soft colour fields in the brand palette drifting over the teal ground on a 24s
loop, with the real hero copy on top so readability can be judged against the
actual headline. CSS only — no WebGL context, no canvas, no animation frame
loop, so there is nothing to pause when the tab hides. A constellation field or
an aurora shader would both read as a tech demo on a wedding document; a slow
warm drift does not.

Measured rather than eyeballed, by `npm run brand`: the loop closes with a
**max channel delta of 0** between t=0 and t=24, the drift averages **12 levels**
over a quarter period (perceptible, not distracting), and white copy keeps a
worst-case **7.57:1** contrast across the whole loop.

## The 3D showcase

`/showcase` shows a biodata as a printed sheet: an A4 plane, subdivided and
bowed so light moves across the curve, carrying the real template as a texture.
It is the one thing 3D does here that 2D cannot — the product sells a piece of
paper, and a flat preview never quite says so.

It is deliberately off the buying flow. The scene is behind a client boundary
and a `next/dynamic` import with `ssr: false`, so three.js, react-three-fiber
and drei load only when someone opens that route:

| Route | First Load JS | 3D loaded after |
| --- | --- | --- |
| `/en` (home) | 121 kB | none |
| `/en/templates` | 168 kB | none |
| `/en/editor` | 215 kB | none |
| `/showcase` | 103 kB | **237 kB gzipped** |

So the showcase costs about 340 kB gzipped against the home page's 121 kB.
That is the number to weigh before linking to it from anywhere. For families on
a budget Android phone and a slow connection, it is a lot of JavaScript to
spend on a page that does not get them a PDF.

Two things worth knowing if you work on it:

- **Tone mapping is off.** R3F defaults to ACES filmic, which grades the scene
  like a film frame and turns the templates' cream stock a dull grey. A
  document should render the colour it will print.
- **The textures are generated, not committed.** `npm run thumbs` renders each
  template's sample page to `public/brand/thumbs/` via the same `/print/sample`
  route the proof sheets use, so the paper always carries the current design.
  That directory is gitignored; the route degrades to an empty sheet without it.

## Three animation systems, and who owns what

The project ended up running three, which is where multi-library trouble
usually starts. The division is deliberate and nothing crosses it:

| System | Owns | Where |
| --- | --- | --- |
| CSS | `opacity` crossfades, `background-position` drift | colour swatches, hero ambience |
| Motion | `opacity`, `scale`, `x`, `y`, layout projection | gallery, editor steps, order states |
| R3F `useFrame` | `rotation.x`, `rotation.y` on a Three.js object | `/showcase` only |

No property is animated by two of them, and there is no Motion inside the
Canvas — no second declarative layer arguing with the frame loop over the same
transform. That is the single pitfall that makes these stacks miserable, and
the audit for it is a grep, not a vibe.

The showcase renders **on demand**, not continuously. Damping towards the
pointer is asymptotic, so the loop asks for the next frame while it is still
moving, snaps to the target once it is within 1e-4, and lets go. Measured by
counting WebGL draw calls from outside the app:

| | idle, 3 seconds |
| --- | --- |
| `frameloop` default | 216 draw calls |
| `frameloop="demand"` | **0 draw calls** |

A sheet of paper sitting still has no business holding the GPU at 60fps.

One leak worth knowing about: the curved plane is built by hand in a `useMemo`
rather than by JSX, so R3F does not own it and will not dispose it. Every
template switch unmounts the sheet, so without an explicit `geometry.dispose()`
each switch would strand a subdivided plane.

## A trap worth knowing

`next build` and `next dev` share `.next`. Running a production build while the
dev server is up leaves the dev server serving chunks that no longer exist: the
page still renders, because the server-rendered HTML is fine, but hydration
dies on a 404 and every control silently stops responding. It looks exactly
like a broken component. Restart the dev server after any build.

## Still to do

- Razorpay keys and a real test payment. The DB-backed order, download and
  webhook paths have never been run; Docker was not available on this machine.
- A test print on real paper, inkjet and laser. `npm run proofs` writes all 26
  to `proofs/*.pdf`. Screen colour is not ink: the devotional watermarks are set
  at 13-16% for exactly this reason and still need confirming.
- Native-speaker review of the Hindi and Marathi copy.
- The legal page is structure and a plain-language summary, with marked
  placeholders for counsel. Nothing in it is drafted.
- The deity marks are clean vector work but simple; Ganesha in particular would
  repay an illustrator's pass before launch.
