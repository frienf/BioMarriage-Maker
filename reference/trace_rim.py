"""Trace the kanha oval's inner rim and emit an SVG clip-path (relative to slot origin)."""
from PIL import Image
import numpy as np, json

im = np.asarray(Image.open('assets/frames/kanha.jpg').convert('RGB')).astype(np.float32)
lum = 0.2126 * im[:, :, 0] + 0.7152 * im[:, :, 1] + 0.0722 * im[:, :, 2]
dark = lum < 165
CX = 1313.0

rows = []
for y in range(180, 620):
    xs = np.where(dark[y, 1120:1505])[0] + 1120
    if len(xs) < 2:
        continue
    clusters = []
    start = xs[0]; prev = xs[0]
    for x in xs[1:]:
        if x - prev > 8:
            clusters.append((int(start), int(prev))); start = x
        prev = x
    clusters.append((int(start), int(prev)))
    gi = None
    for i in range(len(clusters) - 1):
        if clusters[i][1] < CX < clusters[i + 1][0]:
            gi = i
            break
    if gi is None:
        continue
    if clusters[gi + 1][0] - clusters[gi][1] > 240:
        continue
    rows.append((y, clusters[gi][1], clusters[gi + 1][0]))

# keep the longest run of consecutive rows (the main opening; drops the notch above the arch)
runs = []
cur = [rows[0]]
for r in rows[1:]:
    if r[0] - cur[-1][0] <= 2:
        cur.append(r)
    else:
        runs.append(cur); cur = [r]
runs.append(cur)
runs.sort(key=len, reverse=True)
rows = runs[0]
ys = [r[0] for r in rows]
print('main opening rows', ys[0], '..', ys[-1], 'count', len(rows))

L = [r[1] for r in rows]
R = [r[2] for r in rows]

def smooth(vals):
    v = np.array(vals, dtype=float)
    pad = np.pad(v, (2, 2), mode='edge')
    return np.convolve(pad, [1, 4, 6, 4, 1], mode='valid') / 16

Lx = smooth(L)
Rx = smooth(R)

y0 = ys[0] - 0.5           # top apex line (row above first gap row)
y1 = ys[-1] + 0.5          # bottom apex line
x0 = float(np.min(Lx))
x1 = float(np.max(Rx))
print('opening print px: x %.1f..%.1f  y %.1f..%.1f  w %.1f h %.1f' % (x0, x1, y0, y1, x1 - x0, y1 - y0))
print('opening CSS px:   x %.1f..%.1f  y %.1f..%.1f  w %.1f h %.1f' % (x0/2, x1/2, y0/2, y1/2, (x1 - x0)/2, (y1 - y0)/2))
cxs = (Lx + Rx) / 2
print('centre x min/max: %.2f / %.2f' % (cxs.min(), cxs.max()))

# slot origin: top apex row, min left edge
sx, sy = x0, y0
sw, sh = x1 - x0, y1 - y0
# path points (CSS px relative to slot origin)
rp = [((Rx[i] - sx) / 2, (ys[i] - sy) / 2) for i in range(len(ys))]
lp = [((Lx[i] - sx) / 2, (ys[i] - sy) / 2) for i in range(len(ys))]

def dec(pts, step=2):
    sel = pts[::step]
    if sel[-1] != pts[-1]:
        sel.append(pts[-1])
    return sel

rp2 = dec(rp, 2)
lp2 = dec(lp, 2)[::-1]        # bottom -> top on the left side

def fmt(v):
    s = f'{v:.2f}'
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
    return s

topx = (CX - sx) / 2
botx = (CX - sx) / 2
sp = f'M {fmt(topx)} 0'
sp += ' L ' + ' L '.join(f'{fmt(x)} {fmt(y)}' for x, y in rp2)
sp += f' L {fmt(botx)} {fmt(sh / 2)}'
sp += ' L ' + ' L '.join(f'{fmt(x)} {fmt(y)}' for x, y in lp2)
sp += ' Z'

out = {
    'opening_print': {'left': float(x0), 'right': float(x1), 'top': float(y0), 'bottom': float(y1)},
    'slot_css': {'x': round(sx / 2, 2), 'y': round(sy / 2, 2), 'w': round(sw / 2, 2), 'h': round(sh / 2, 2)},
    'path': sp,
}
with open('reference/kanha-slot-path.json', 'w') as f:
    json.dump(out, f, indent=1)
print('slot css:', out['slot_css'])
print('path points:', len(rp2) + len(lp2) + 2, 'chars:', len(sp))
