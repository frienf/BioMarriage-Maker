import fs from 'node:fs';
fs.renameSync('public/templates/design-01', 'public/templates/lakshmi-elephants-01');
fs.renameSync('public/templates/design-02', 'public/templates/green-lotus-02');
fs.renameSync('public/templates/design-03', 'public/templates/murugan-vel-03');
fs.renameSync('public/templates/design-04', 'public/templates/stone-arch-04');
console.log('renamed back');
