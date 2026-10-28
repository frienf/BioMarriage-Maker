const fs = require('fs');
const p = 'C:\\Users\\Admin\\Desktop\\Biodata Maker\\src\\templates\\catalog.ts';
let c = fs.readFileSync(p, 'utf8');
c = c.replace("accent: '#8A4B12'", "accent: '#234E52'").replace("accent: '#5A1E3A'", "accent: '#5a3e2b'");
fs.writeFileSync(p, c);
console.log('fixed');
