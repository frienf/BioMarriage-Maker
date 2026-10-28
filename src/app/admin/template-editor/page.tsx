import { notFound } from 'next/navigation';

export default function AdminTemplateEditor() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return (
    <div style={{ padding: 24 }}>
      <h1>Template Editor (dev only)</h1>
      <p>Load an image, drag/resize boxes, export manifest.json. (Scaffold — full editor TBD.)</p>
    </div>
  );
}
