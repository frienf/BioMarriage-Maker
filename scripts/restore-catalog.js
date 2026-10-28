const fs = require('fs');
const path = 'C:\\Users\\Admin\\Desktop\\Biodata Maker\\src\\templates\\catalog.ts';
const files = [
  'public/templates/lakshmi-elephants-01/manifest.json',
  'public/templates/green-lotus-02/manifest.json',
  'public/templates/murugan-vel-03/manifest.json',
  'public/templates/stone-arch-04/manifest.json',
];
const ids = files.map(f => f.split('/')[2]);
let content = fs.readFileSync(path, 'utf8');
const replacements = [
  { oldSlug: 'design-01', newSlug: 'lakshmi-elephants-01', newTitle: 'Lakshmi Elephants', newManifest: 'lakshmi-elephants-01', newAccent: '#7B1E2B' },
  { oldSlug: 'design-02', newSlug: 'green-lotus-02', newTitle: 'Green Lotus', newManifest: 'green-lotus-02', newAccent: '#234E52' },
  { oldSlug: 'design-03', newSlug: 'murugan-vel-03', newTitle: 'Murugan Vel', newManifest: 'murugan-vel-03', newAccent: '#800020' },
  { oldSlug: 'design-04', newSlug: 'stone-arch-04', newTitle: 'Stone Arch', newManifest: 'stone-arch-04', newAccent: '#5a3e2b' },
];
for (const r of replacements) {
  content = content.replace(r.oldSlug, r.newSlug);
  content = content.replace(`manifestId: '${r.oldSlug}'`, `manifestId: '${r.newManifest}'`);
  content = content.replace(`title: 'Design ${r.oldSlug.slice(-2)}'`, `title: '${r.newTitle}'`);
  content = content.replace(`accent: '${r.newAccent}'`, `accent: '${r.newAccent}'`);
}
fs.writeFileSync(path, content);
console.log('catalog restored');
