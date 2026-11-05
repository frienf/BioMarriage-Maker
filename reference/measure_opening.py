"""Measure the kanha print copy: opening ellipse fit, frame extent, intrusions."""
from PIL import Image
import numpy as np
import math

im = np.asarray(Image.open('assets/frames/kanha.jpg').convert('RGB')).astype(np.float32)
lum = 0.2126 * im[:, :, 0] + 0.7152 * im[:, :, 1] + 0.0722 * im[:, :, 2]
H, W = lum.shape
print('canvas', W, H)

# ---------- 1) Opening: inner edge clusters per row ----------
dark = lum < 165
rows = []
for y in range(230, 565):
    xs = np.where(dark[y, 1100:1500])[0] + 1100
    if len(xs) == 0:
        continue
    clusters = []
    start = xs[0]; prev = xs[0]
    for x in xs[1:]:
        if x - prev > 8:
            clusters.append((start, prev)); start = x
        prev = x
    clusters.append((start, prev))
    if len(clusters) >= 2:
        rows.append((y, clusters[0][1], clusters[-1][0]))

# ---------- 2) Fit ellipse cx, cy, a, b to inner edges ----------
# initial guess from clean middle rows
mid = [r for r in rows if 330 <= r[0] <= 460]
cx = np.mean([(r[1] + r[2]) / 2 for r in mid])
a = np.mean([(r[2] - r[1]) for r in mid]) / 2
# cy from vertical extent at x ~ cx
col_dark = np.where(dark[:, int(round(cx))])[0]
top_inner = None; bot_inner = None
# find rim inner edges at centre column: runs of dark between y 100 and 700
ys = col_dark[(col_dark > 100) & (col_dark < 700)]
runs = []
start = ys[0]; prev = ys[0]
for y in ys[1:]:
    if y - prev > 3:
        runs.append((start, prev)); start = y
    prev = y
runs.append((start, prev))
print('centre-column dark runs:', runs)
top_inner = runs[0][1] + 1 if False else None
# opening top = end of the last run before mid; opening bottom = start of first run after mid
midy = 395
above = [r for r in runs if r[1] < midy]
below = [r for r in runs if r[0] > midy]
top_inner = max(r[1] for r in above) + 0.5
bot_inner = min(r[0] for r in below) - 0.5
b = (bot_inner - top_inner) / 2
cy = (top_inner + bot_inner) / 2
print(f'initial: cx={cx:.1f} cy={cy:.1f} a={a:.1f} b={b:.1f}')

# refine cx, a by least squares on inner edges vs ellipse
def ellipse_half_width(y, cy, b, a):
    t = (y - cy) / b
    if abs(t) >= 1:
        return None
    return a * math.sqrt(max(0.0, 1 - t * t))

# simple iterative refinement: minimize max error over clean rows
best = None
for _ in range(60):
    # solve for cx, a given cy, b with linear least squares: x = cx ± a*sqrt(1-t^2)
    A = []; L = []
    for (y, l, r) in rows:
        t = (y - cy) / b
        if abs(t) >= 1:
            continue
        s = math.sqrt(1 - t * t)
        A.append([1, -s]); L.append(l)
        A.append([1, +s]); L.append(r)
    A = np.array(A); L = np.array(L)
    sol, *_ = np.linalg.lstsq(A, L, rcond=None)
    cx_new, a_new = sol
    # refine cy, b similarly using columns: skip (vertical scan already tight)
    if best and abs(cx_new - cx) < 1e-6 and abs(a_new - a) < 1e-6:
        cx, a = cx_new, a_new
        break
    cx, a = cx_new, a_new
print(f'fitted: cx={cx:.2f} cy={cy:.2f} a={a:.2f} b={b:.2f}')

# worst-case misfit over sampled rows (exclude rows contaminated by scrollwork: |res| big)
res = []
for (y, l, r) in rows:
    t = (y - cy) / b
    if abs(t) >= 1:
        continue
    s = math.sqrt(1 - t * t)
    pl, pr = cx - a * s, cx + a * s
    res.append((y, l - pl, r - pr))
res_arr = np.array([(y, max(abs(dl), abs(dr))) for y, dl, dr in res])
print('misfit (max over L/R) per row: sorted:', sorted(res_arr[:,1], reverse=True)[:12])
print('median misfit:', np.median(res_arr[:,1]), 'max:', res_arr[:,1].max())
clean = res_arr[res_arr[:,1] < 6]
print('clean rows', len(clean), 'max misfit', clean[:,1].max() if len(clean) else None)

# ---------- 3) Frame connected component extent ----------
from collections import deque
seed = (int(round(cy)), int(round(cx)))  # cy,cx — inside opening (light), not dark!
# seed on the rim instead: dark pixel at top centre of rim
seed_r = int(round(cy - b)) - 2
assert dark[seed_r, int(round(cx))], 'seed not on rim'
region = dark[100:680, 1100:1500]
Hh, Ww = region.shape
lab = np.zeros((Hh, Ww), dtype=bool)
q = deque([(seed_r - 100, int(round(cx)) - 1100)])
lab[q[0]] = True
cnt = 0
while q:
    yy, xx = q.popleft()
    cnt += 1
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = yy + dy, xx + dx
        if 0 <= ny < Hh and 0 <= nx < Ww and region[ny, nx] and not lab[ny, nx]:
            lab[ny, nx] = True
            q.append((ny, nx))
ys2, xs2 = np.where(lab)
print('frame component px', cnt)
print('frame extent (print px): x', xs2.min()+1100, '..', xs2.max()+1100, ' y', ys2.min()+100, '..', ys2.max()+100)
print('frame extent (CSS px):   x', (xs2.min()+1100)/2, '..', (xs2.max()+1100)/2, ' y', (ys2.min()+100)/2, '..', (ys2.max()+100)/2)
print('opening (print px): cx %.1f cy %.1f a %.1f b %.1f' % (cx, cy, a, b))
print('opening edges print: L %.1f R %.1f T %.1f B %.1f' % (cx-a, cx+a, cy-b, cy+b))
print('opening edges CSS:   L %.1f R %.1f T %.1f B %.1f' % ((cx-a)/2, (cx+a)/2, (cy-b)/2, (cy+b)/2))
print('moulding L %.1f R %.1f T %.1f B %.1f (print px)' % (cx-a-(xs2.min()+1100), (xs2.max()+1100)-(cx+a), cy-b-(ys2.min()+100), (ys2.max()+100)-(cy+b)))
print('moulding L %.1f R %.1f T %.1f B %.1f (CSS px)' % ((cx-a-(xs2.min()+1100))/2, ((xs2.max()+1100)-(cx+a))/2, (cy-b-(ys2.min()+100))/2, ((ys2.max()+100)-(cy+b))/2))
