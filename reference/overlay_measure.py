"""Draw the measured geometry over the print copy for visual verification."""
from PIL import Image, ImageDraw, ImageFont
import json

im = Image.open('assets/frames/kanha.jpg').convert('RGB')
d = ImageDraw.Draw(im, 'RGBA')
S = 1.0  # print px

data = json.load(open('reference/kanha-slot-path.json'))
# re-draw the path from its points by re-tracing quickly (same algorithm, compact)
import numpy as np
src = np.asarray(Image.open('assets/frames/kanha.jpg').convert('RGB')).astype(np.float32)
lum = 0.2126*src[:,:,0] + 0.7152*src[:,:,1] + 0.0722*src[:,:,2]
dark = lum < 165
CX = 1313.0
rows = []
for y in range(230, 560):
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
# keep longest run
runs = []
cur = [rows[0]]
for r in rows[1:]:
    if r[0] - cur[-1][0] <= 2:
        cur.append(r)
    else:
        runs.append(cur); cur = [r]
runs.append(cur)
rows = max(runs, key=len)
poly_right = [(r[2], r[0]) for r in rows]
poly_left = [(r[1], r[0]) for r in rows]
poly = poly_right + poly_left[::-1]
d.line(poly + [poly[0]], fill=(255, 0, 0, 255), width=2, joint='curve')

def rect(box, colour, width=3):
    d.rectangle(box, outline=colour, width=width)

# frame extent (blue)
rect((1143, 114, 1483, 617), (0, 120, 255, 255))
# text box (green): css (139,325)-(651,908) -> print (278,650)-(1302,1816)
rect((278, 650, 1302, 1816), (0, 180, 0, 255))
# emblem lowest (orange) y=478; corner crests (magenta) y=1832; BC crests y=1985/1996
for y, c in [(478, (255, 140, 0, 255)), (1832, (255, 0, 255, 255)), (1985, (200, 0, 200, 255)), (1996, (200, 0, 200, 255))]:
    d.line([(0, y), (1588, y)], fill=c, width=2)
# intrusion points
d.ellipse((255, 1442, 269, 1456), outline=(255, 0, 0, 255), width=2)
d.ellipse((1312, 1162, 1326, 1176), outline=(255, 0, 0, 255), width=2)
try:
    font = ImageFont.truetype('arial.ttf', 18)
except Exception:
    font = ImageFont.load_default()
d.text((10, 10), 'red=opening  blue=frame extent  green=text box', fill=(0, 0, 0, 255), font=font)
im.save('reference/measure_overlay.png')
print('saved reference/measure_overlay.png', im.size)
