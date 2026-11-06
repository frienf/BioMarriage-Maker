import sharp from 'sharp';

/** Accept decoded, static raster data URLs only; the uploader emits JPEG. */
export async function validPhoto(src: string): Promise<boolean> {
  if (!src) return true;
  const match = /^data:image\/(jpeg|png|webp);base64,/.exec(src);
  if (!match) return false;
  const encoded = src.slice(match[0].length);
  if (!encoded || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) return false;
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.toString('base64') !== encoded) return false;
  if (match[1] === 'png' && !staticPng(bytes)) return false;
  try {
    const image = sharp(bytes, { failOn: 'warning', limitInputPixels: 40_000_000 });
    const metadata = await image.metadata();
    if (metadata.format !== match[1] || (metadata.pages ?? 1) > 1) return false;
    await image.resize(1, 1).raw().toBuffer();
    return true;
  } catch {
    return false;
  }
}

/** Parse PNG chunks so compressed data containing a chunk name is not mistaken for animation. */
function staticPng(bytes: Buffer): boolean {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (bytes.length < signature.length || !bytes.subarray(0, 8).equals(signature)) return false;
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) return false;
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    if (type === 'acTL') return false;
    if (type === 'IEND') return length === 0 && end === bytes.length;
    offset = end;
  }
  return false;
}
