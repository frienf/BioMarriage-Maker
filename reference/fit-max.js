/* Max-load fit check for sudarshana via the temporary debug page. */
import { chromium } from 'playwright';

const origin = 'http://localhost:3000';
const A4_H = 1123;

const base = (loc) => ({
  templateSlug: 'sudarshana',
  docLocale: loc,
  fullName: loc === 'en' ? 'Ananya Prakash Kulkarni-Agarwal-Singhania' : (loc === 'hi' ? 'अनन्या प्रकाश कुलकर्णी-अग्रवाल-सिंघानिया' : 'अनन्या प्रकाश कुलकर्णी-अग्रवाल-सिंघानिया'),
  profileType: 'bride',
  dob: '1997-03-14',
  tob: '06:40',
  pob: loc === 'en' ? 'Pune' : (loc === 'hi' ? 'पुणे' : 'पुणे'),
  heightCm: 163,
  religion: loc === 'en' ? 'Hindu' : (loc === 'hi' ? 'हिंदू' : 'हिंदू'),
  caste: 'Maratha',
  motherTongue: loc === 'en' ? 'Marathi' : (loc === 'hi' ? 'मराठी' : 'मराठी'),
  nativePlace: loc === 'en' ? 'Satara, Maharashtra' : (loc === 'hi' ? 'सातारा, महाराष्ट्र' : 'सातारा, महाराष्ट्र'),
  diet: 'vegetarian',
  complexion: 'Fair',
  education: [
    { qualification: 'M.Sc. Data Science', institution: 'Pune University', year: '2020' },
    { qualification: 'B.Sc. Statistics', institution: 'Fergusson College', year: '2018' },
    { qualification: 'HSC', institution: 'Abasaheb Garware College', year: '2016' }
  ],
  occupation: 'Senior Data Analyst and Machine Learning Engineer',
  employer: 'Healthcare technology and AI startup',
  workLocation: loc === 'en' ? 'Pune' : (loc === 'hi' ? 'पुणे' : 'पुणे'),
  income: '₹25,00,000 per annum',
  showFamily: true,
  fatherName: loc === 'en' ? 'Prakash Kulkarni' : (loc === 'hi' ? 'प्रकाश कुलकर्णी' : 'प्रकाश कुलकर्णी'),
  fatherOccupation: 'Retired bank manager and financial consultant',
  motherName: loc === 'en' ? 'Smita Kulkarni' : (loc === 'hi' ? 'स्मिता कुलकर्णी' : 'स्मिता कुलकर्णी'),
  motherOccupation: 'School teacher and principal',
  siblings: [
    { relation: 'brother', name: 'Rohan Kulkarni', note: 'younger, B.Tech final year' },
    { relation: 'sister', name: 'Isha Kulkarni', note: 'elder, MBA graduate' },
    { relation: 'brother', name: 'Siddharth Kulkarni', note: 'youngest, medical student' },
    { relation: 'sister', name: 'Meera Kulkarni', note: 'elder, software engineer' }
  ],
  familyType: 'nuclear',
  familyNativePlace: 'Satara, Maharashtra',
  showHoroscope: true,
  rashi: 'Mesh',
  nakshatra: 'Ashwini',
  gotra: 'Kashyap',
  gan: 'Deva',
  nadi: 'Madhya',
  charan: '2',
  manglik: 'no',
  about: 'Calm, curious and close to family. Enjoys classical music, weekend treks, reading, cooking, gardening, painting, photography, travelling and learning new languages.',
  expectations: 'A kind, well-educated, understanding and family-oriented partner who values mutual respect, shared goals and a balanced life. Pune or Mumbai preferred, open to relocation for the right opportunity. Someone who enjoys festivals, food and meaningful conversation.',
  contactName: loc === 'en' ? 'Prakash Kulkarni' : (loc === 'hi' ? 'प्रकाश कुलकर्णी' : 'प्रकाश कुलकर्णी'),
  phone: '+91 98000 00010',
  altPhone: '+91 96000 00034',
  email: 'ananya.kulkarni@example.com',
  address: 'Kothrud, Pune, Maharashtra 411029, India'
});

const browser = await chromium.launch();
const page = await browser.newPage();

let over = [];
for (const loc of ['en', 'hi', 'mr']) {
  const id = `sudarshana/max/${loc}`;
  await page.goto(`${origin}/print/debug-max/sudarshana?lang=${loc}&data=${encodeURIComponent(JSON.stringify(base(loc)))}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-print-ready="true"]', { state: 'attached', timeout: 30000 });
  // Let web fonts and any late layout settle (the official fit-check uses networkidle).
  await new Promise((r) => setTimeout(r, 2000));
  const heights = await page.evaluate(() => [...document.querySelectorAll('article')].map((a) => a.scrollHeight));
  const worst = Math.max(...heights);
  const delta = worst - A4_H;
  const flag = delta > 2 ? 'OVER' : 'ok  ';
  if (delta > 2) over.push(`${id} (+${delta}px)`);
  console.log(`${flag} ${id.padEnd(22)} ${worst}px`);
}

await browser.close();
if (over.length) {
  console.error(`\n${over.length} max-load case(s) clip: ${over.join(', ')}`);
  process.exit(1);
}
console.log('\nsudarshana max-load fits in all locales.');
