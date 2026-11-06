import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';

export function storageDir(): string {
  return path.resolve(process.env.STORAGE_DIR ?? './storage');
}

function validate(token: string, revision: number) {
  if (!/^[A-Za-z0-9_-]+$/.test(token) || !Number.isSafeInteger(revision) || revision < 0) {
    throw new Error('Invalid PDF identity');
  }
}

export function pdfPathFor(token: string, revision = 0, dir = storageDir()): string {
  validate(token, revision);
  return path.join(dir, revision === 0 ? `${token}.pdf` : `${token}.${revision}.pdf`);
}

/** Remove only known legacy/revision cache and temporary names for this token. */
export async function removeOrderPdfs(token: string, dir = storageDir()): Promise<void> {
  validate(token, 0);
  let names: string[];
  try { names = await readdir(dir); } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
  const prefix = `${token}.`;
  const revisionFile = /^\d+\.pdf$/;
  const temporaryFile = /^\d+\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/;
  for (const name of names) {
    if (name === `${token}.pdf` || (name.startsWith(prefix) &&
      (revisionFile.test(name.slice(prefix.length)) || temporaryFile.test(name.slice(prefix.length))))) {
      await rm(path.join(dir, name), { force: true });
    }
  }
}
