import { strict as assert } from 'node:assert';

// Run only against the isolated development server with DATABASE_URL unset.
const origin = 'http://127.0.0.1:3117';
const biodata = {
  templateSlug: 'kumkum', docLocale: 'en', fullName: 'Synthetic Test',
  profileType: 'bride', dob: '1990-01-01', phone: '+919876543210',
  photo: { src: 'http://127.0.0.1:3117/private', position: '50% 30%' }
};
async function post(body) {
  return fetch(`${origin}/api/orders`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
}
for (const src of ['http://127.0.0.1:3117/private', 'http://169.254.169.254/latest/meta-data/', 'file:///private', 'data:image/svg+xml;base64,PHN2Zy8+']) {
  assert.equal((await post({ biodata: { ...biodata, photo: { ...biodata.photo, src } } })).status, 400, 'unsafe photo must be rejected before order creation');
}
assert.equal((await post(null)).status, 400);
assert.equal((await post({ biodata, padding: 'a'.repeat(4_100_001) })).status, 413);
console.log('Order photo validation and body limits passed.');
