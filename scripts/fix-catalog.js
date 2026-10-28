const fs = require('fs');
const path = 'C:\\Users\\Admin\\Desktop\\Biodata Maker\\src\\templates\\catalog.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  /{ slug: 'lakshmi-elephants-01', title: 'Lakshmi Elephants', collection: 'traditional', layout: 'artwork', manifestId: 'lakshmi-elephants-01', accent: '#7B1E2B', pricePaise: PRICE\.standard, docLocales: ALL, pages: 1,\n    blurb: 'TODO: image-based artwork template\.' }/g,
  "{ slug: 'design-01', title: 'Design 01', collection: 'traditional', layout: 'artwork', manifestId: 'design-01', accent: '#7B1E2B', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' }"
);
content = content.replace(
  /{ slug: 'green-lotus-02', title: 'Green Lotus', collection: 'traditional', layout: 'artwork', manifestId: 'green-lotus-02', accent: '#234E52', pricePaise: PRICE\.standard, docLocales: ALL, pages: 1,\n    blurb: 'TODO: image-based artwork template\.' }/g,
  "{ slug: 'design-02', title: 'Design 02', collection: 'traditional', layout: 'artwork', manifestId: 'design-02', accent: '#8A4B12', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' }"
);
content = content.replace(
  /{ slug: 'murugan-vel-03', title: 'Murugan Vel', collection: 'devotional', layout: 'artwork', manifestId: 'murugan-vel-03', accent: '#800020', pricePaise: PRICE\.standard, docLocales: ALL, pages: 1,\n    blurb: 'TODO: image-based artwork template\.' }/g,
  "{ slug: 'design-03', title: 'Design 03', collection: 'devotional', layout: 'artwork', manifestId: 'design-03', accent: '#800020', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' }"
);
content = content.replace(
  /{ slug: 'stone-arch-04', title: 'Stone Arch', collection: 'premium', layout: 'artwork', manifestId: 'stone-arch-04', accent: '#5a3e2b', pricePaise: PRICE\.premium, docLocales: ALL, pages: 1,\n    blurb: 'TODO: image-based artwork template\.' }/g,
  "{ slug: 'design-04', title: 'Design 04', collection: 'premium', layout: 'artwork', manifestId: 'design-04', accent: '#5A1E3A', pricePaise: PRICE.premium, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' }"
);
fs.writeFileSync(path, content);
console.log('catalog edited');
