import { ManifestSchema, type Manifest } from './schema';
import type { TemplateEntry } from './types';

const BASE = '/templates';

export async function loadIndex(): Promise<string[]> {
  const res = await fetch(`${BASE}/index.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load template index');
  return res.json();
}

export async function loadManifest(id: string): Promise<Manifest> {
  const res = await fetch(`${BASE}/${id}/manifest.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load manifest for ${id}`);
  const json = await res.json();
  return ManifestSchema.parse(json);
}

export async function loadTemplate(id: string): Promise<TemplateEntry> {
  const manifest = await loadManifest(id);
  const v = manifest.version;
  return {
    id,
    version: v,
    thumb: `${BASE}/${id}/thumb.webp?v=${v}`,
    background: `${BASE}/${id}/background.webp?v=${v}`,
    manifest,
  };
}

export async function loadAllTemplates(): Promise<TemplateEntry[]> {
  const ids = await loadIndex();
  return Promise.all(ids.map(loadTemplate));
}
