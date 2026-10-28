'use client';

import { useEffect, useState } from 'react';

/**
 * Marks the document ready only once every font and every image has loaded.
 *
 * Printing before `document.fonts.ready` is how a Devanagari conjunct comes out
 * in a fallback face, or as an empty box, on a document nobody can reprint.
 * An image that never decodes (a deity figure that 404s, a broken photo) leaves
 * the flag false on purpose: the PDF render times out and fails, rather than
 * printing a paid document with a blank where the picture should be.
 */
export function PrintReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };
    const images = () => Promise.all([...document.images].map((img) => img.decode()));
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(images, images).then(done, () => {});
    } else {
      images().then(done, () => {});
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return <div data-print-ready={ready ? 'true' : 'false'} style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }} />;
}
