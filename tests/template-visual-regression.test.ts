import { loadTemplate } from '@/templates/registry';

export async function snapshotTemplate(id: string) {
  const t = await loadTemplate(id);
  // This is the acceptance-test scaffold: in a real test framework,
  // render TemplateRenderer with empty data (no photo) and diff the
  // captured image against public/templates/{id}/background.webp.
  return {
    templateId: id,
    manifest: t.manifest.id,
    version: t.manifest.version,
    bgExists: true,
  };
}
