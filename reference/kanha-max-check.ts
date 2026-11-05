import { writeFileSync } from 'node:fs';
import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChitraTemplate } from '../src/templates/chitra.tsx';
import { sampleFor } from '../src/templates/sample.ts';
import type { DocLocale } from '../src/lib/biodata.ts';

// The local tsx runner uses classic JSX; Next normally supplies this transform.
Object.assign(globalThis, { React });

for (const locale of ['en', 'hi', 'mr'] as DocLocale[]) {
  const data = {
    ...sampleFor('kanha', locale),
    caste: 'Maratha', complexion: 'Wheatish',
    education: [
      { qualification: 'M.Sc. Data Science', institution: 'Pune University', year: '2020' },
      { qualification: 'B.Sc. Statistics', institution: 'Fergusson College', year: '2018' },
      { qualification: 'HSC', institution: 'Pune College', year: '2016' }
    ],
    employer: 'Healthcare technology', income: '₹25,00,000 per annum',
    siblings: [
      { relation: 'brother' as const, name: 'Rohan', note: 'Engineer' },
      { relation: 'sister' as const, name: 'Isha', note: 'Teacher' },
      { relation: 'brother' as const, name: 'Siddharth', note: 'Doctor' },
      { relation: 'sister' as const, name: 'Meera', note: 'Designer' }
    ],
    familyType: 'nuclear' as const, familyNativePlace: 'Satara',
    rashi: 'Mesh', nakshatra: 'Ashwini', gotra: 'Kashyap', gan: 'Deva', nadi: 'Madhya', charan: '2',
    about: 'Calm, curious and close to family. Enjoys music, reading and weekend treks.',
    expectations: 'A kind, understanding partner who values mutual respect, shared goals and family. Pune or Mumbai preferred, with an interest in a balanced life together.'.slice(0, 150),
    altPhone: '+91 96000 00034', email: 'ananya@example.com'
  };
  const html = renderToStaticMarkup(createElement(ChitraTemplate, { data, slug: 'kanha' }));
  writeFileSync(`reference/kanha-max-${locale}.html`, html);
}
