import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { CHITRA_FRAMES } from './chitra-frames.ts';

/**
 * The full-size frame image as a data URI, for the print pages only.
 *
 * The print copy lives outside public/ so the clean blank frame never has a
 * URL; the gallery and editor get the 600px preview copy instead. A missing
 * file throws, so the PDF render fails rather than printing a page with no frame.
 */
export async function frameDataUri(slug: string): Promise<string> {
  // Only a known frame: the slug becomes a file path.
  if (!Object.hasOwn(CHITRA_FRAMES, slug)) throw new Error(`unknown frame: ${slug}`);
  const jpg = await readFile(path.join(process.cwd(), 'assets', 'frames', `${slug}.jpg`));
  return `data:image/jpeg;base64,${jpg.toString('base64')}`;
}
