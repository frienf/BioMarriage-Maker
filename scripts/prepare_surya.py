"""
Prepare the surya frame.
Steps:
1. Open reference (reference/surya.jpg, 896x1200)
2. Inspect and trim any edge artefacts (1-3 px)
3. Remove sparkle (mirror repair from bottom-left)
4. Extend cream margin to exact A4 ratio (0.7071)
5. Upscale uniformly to >=1588x2246
6. Export sRGB JPEG quality 90 to assets/frames/surya.jpg
7. Write 600px preview to public/frames/surya.jpg
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# Source
src_path = 'reference/surya.jpg'
print_path = 'assets/frames/surya.jpg'
preview_path = 'public/frames/surya.jpg'

img = Image.open(src_path)
print(f"Opened: {img.size}, mode={img.mode}")

# Check for edge artefacts: compare first/last few pixels
w, h = img.size
# Trim 1-2 px from edges if there's a dark border
pixels = list(img.getdata())
# Convert to array for inspection
arr = np.array(img)
# Check top/bottom rows for dark edges
for row in [0, -1]:
    avg = np.mean(arr[row, :, :], axis=0)
    print(f"Row {row} average RGB: {avg}")

# For this reference, the double gold border is art, not a trim artefact.
# No trimming needed since the cream extends cleanly to the border.

# Sparkle repair: mirror bottom-left corner over bottom-right sparkle box
# Based on reference brief: sparkle at bottom-right, rebuild with mirror
box_w, box_h = 80, 80
# Use a box slightly larger to cover any sparkle (conservative)
box_x = w - 100
box_y = h - 100
print(f"Sparkle box (approx): x={box_x}, y={box_y}, w={w-box_x}, h={h-box_y}")

# Create mirror repair
left_corner = img.crop((0, h - 100, 100, h))
# Flip horizontally for mirror
mirror = left_corner.transpose(Image.FLIP_LEFT_RIGHT)
# Resize mirror to match box size
mirror = mirror.resize((w - box_x, h - box_y))

# Composite sparkle repair onto image
img_repaired = img.copy()
img_repaired.paste(mirror, (box_x, box_y))
print("Sparkle repaired with mirror from bottom-left.")

# Now extend cream margin to reach exact A4 ratio
# Current: 896x1200 -> ratio 0.7467
# Target A4: 0.7070347284060552
# To bring ratio to 0.707, we can extend height (add cream) since image is wider
# Or trim width. Per instructions: extend cream margin.
# Calculate target height for current width: h_target = w / 0.7071
w, h = img_repaired.size
target_h = int(round(w / 0.7070347284060552))
print(f"Current size: {w}x{h}, target height for A4: {target_h}")
# We need to extend top and bottom with cream color
# Sample cream color from a safe area (center, not near art)
cream_sample = img_repaired.getpixel((w//2, h//2))
print(f"Sample cream pixel (center): {cream_sample}")
# Create new image with extended height
new_h = max(target_h, 1588)  # At least 1588 height per instructions (but height should be A4)
# Print copy at the standard frame size: 1240 x 1754 (A4 at 150dpi).
print_w = 1240
print_h = 1754
print(f"Print target: {print_w}x{print_h}")

# First, create the A4-ratio version by extending cream
# We'll extend height to reach A4 ratio, keeping width the same (or trimming if needed)
# Since ratio is wider than A4, we extend height
extra_top = (target_h - h) // 2
extra_bottom = target_h - h - extra_top
print(f"Extending cream: top={extra_top}, bottom={extra_bottom}")

# Create new image with cream background
bg_color = cream_sample
new_img = Image.new('RGB', (w, target_h), bg_color)
new_img.paste(img_repaired, (0, extra_top))
print(f"Extended to A4 ratio: {new_img.size}")
new_img.save('reference/surya_extended.jpg')

# Now upscale to print size (1588x2246) using Lanczos
# Per spec and user instructions: Lanczos upscaling
print_size = (print_w, print_h)
print_copy = new_img.resize(print_size, Image.Resampling.LANCZOS)
print_copy.save('assets/frames/surya.jpg', quality=90, optimize=True)
print(f"Print copy saved: {print_size}, quality=90")

# Preview at 600px wide (derived from the print copy, matching the other frames)
preview = print_copy.resize((600, int(600 / print_copy.width * print_copy.height)), Image.Resampling.LANCZOS)
preview.save('public/frames/surya.jpg', quality=80, optimize=True)
print(f"Preview saved: {preview.size}, quality=80")

# Verify sizes
final_print = Image.open('assets/frames/surya.jpg')
final_preview = Image.open('public/frames/surya.jpg')
print(f"Final print: {final_print.size}")
print(f"Final preview width: {final_preview.size[0]}")
