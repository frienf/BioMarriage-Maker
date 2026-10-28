const fs = require('fs');
const p = 'C:\\Users\\Admin\\Desktop\\Biodata Maker\\src\\templates\\catalog.ts';
let c = fs.readFileSync(p, 'utf8');
// Fix green-lotus accent back to #234E52
c = c.replace("accent: '#8A4B12', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' },\n  { slug: 'murugan-vel-03'", "accent: '#234E52', pricePaise: PRICE.standard, docLocales: ALL, pages: 1, blurb: 'Image-based artwork from Design Template.' },\n  { slug: 'murugan-vel-03'");
// Fix stone-arch accent back to #5a3e2b (lowercase b) - the replacement above may not have matched due to order
c = c.replace("accent: '#5A1E3A'", "accent: '#5a3e2b'");
fs.writeFileSync(p, c);
console.log('fixed accents');
