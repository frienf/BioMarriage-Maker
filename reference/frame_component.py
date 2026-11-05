"""Connected components of dark pixels in the frame window, to isolate the frame from the vine."""
from PIL import Image
import numpy as np
from collections import deque

im = np.asarray(Image.open('assets/frames/kanha.jpg').convert('RGB')).astype(np.float32)
lum = 0.2126 * im[:, :, 0] + 0.7152 * im[:, :, 1] + 0.0722 * im[:, :, 2]
dark = lum < 165

X0, X1, Y0, Y1 = 1100, 1520, 90, 720
region = dark[Y0:Y1, X0:X1]
Hh, Ww = region.shape
lab = np.full((Hh, Ww), -1, dtype=np.int32)
ncomp = 0
comps = []
for yy in range(Hh):
    for xx in range(Ww):
        if region[yy, xx] and lab[yy, xx] == -1:
            q = deque([(yy, xx)])
            lab[yy, xx] = ncomp
            pts = []
            while q:
                y0, x0 = q.popleft()
                pts.append((y0, x0))
                for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                    ny, nx = y0 + dy, x0 + dx
                    if 0 <= ny < Hh and 0 <= nx < Ww and region[ny, nx] and lab[ny, nx] == -1:
                        lab[ny, nx] = ncomp
                        q.append((ny, nx))
            comps.append(pts)
            ncomp += 1
print('components:', ncomp)
big = sorted(comps, key=len, reverse=True)[:6]
for i, pts in enumerate(big):
    ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
    print('comp', i, 'px', len(pts), 'x', min(xs)+X0, '..', max(xs)+X0, ' y', min(ys)+Y0, '..', max(ys)+Y0)
