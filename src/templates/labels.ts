import type { DocLocale } from '@/lib/biodata';

/**
 * Labels printed on the document itself, in the three languages a biodata can
 * be issued in. Separate from the UI strings: the site can be in English while
 * the document is in Marathi.
 *
 * `hi` and `mr` are typed against `en`, so a missing or stray key is a compile
 * error rather than a blank line on someone's printed biodata.
 */
const en = {
  kickerBiodata: 'Biodata',
  kickerBride: 'Bride',
  kickerGroom: 'Groom',
  invocation: 'Shri Ganeshaya Namah',

  secPersonal: 'Personal details',
  secEducation: 'Education and career',
  secFamily: 'Family details',
  secHoroscope: 'Horoscope',
  secAbout: 'About',
  secExpectations: 'Expectations',
  secContact: 'Contact details',

  dob: 'Date of birth',
  tob: 'Time of birth',
  pob: 'Place of birth',
  birthTimePlace: 'Time and place of birth',
  height: 'Height',
  religion: 'Religion',
  caste: 'Caste',
  motherTongue: 'Mother tongue',
  nativePlace: 'Native place',
  diet: 'Diet',
  complexion: 'Complexion',

  education: 'Education',
  occupation: 'Occupation',
  employer: 'Employer',
  workLocation: 'Work location',
  income: 'Annual income',

  father: 'Father',
  fatherOccupation: "Father's occupation",
  mother: 'Mother',
  motherOccupation: "Mother's occupation",
  brother: 'Brother',
  sister: 'Sister',
  familyType: 'Family type',

  rashi: 'Rashi',
  nakshatra: 'Nakshatra',
  gotra: 'Gotra',
  manglik: 'Manglik',
  gan: 'Gan',
  nadi: 'Nadi',
  charan: 'Charan',

  contactPerson: 'Contact',
  phone: 'Phone',
  altPhone: 'Alternate phone',
  email: 'Email',
  address: 'Address',

  dietVegetarian: 'Vegetarian',
  dietEggetarian: 'Eggetarian',
  dietNonVegetarian: 'Non-vegetarian',
  dietJain: 'Jain',
  dietVegan: 'Vegan',

  manglikNo: 'No',
  manglikYes: 'Yes',
  manglikPartial: 'Partial',
  manglikUnknown: 'Not known',

  familyNuclear: 'Nuclear family',
  familyJoint: 'Joint family',

  unitFt: 'ft',
  unitIn: 'in',
  photoPlaceholder: 'Photo placeholder'
} as const;

export type DocLabelKey = keyof typeof en;

const hi: Record<DocLabelKey, string> = {
  kickerBiodata: 'बायोडाटा',
  kickerBride: 'वधू परिचय',
  kickerGroom: 'वर परिचय',
  invocation: '॥ श्री गणेशाय नमः ॥',

  secPersonal: 'व्यक्तिगत विवरण',
  secEducation: 'शिक्षा और व्यवसाय',
  secFamily: 'पारिवारिक विवरण',
  secHoroscope: 'कुंडली',
  secAbout: 'मेरे बारे में',
  secExpectations: 'अपेक्षाएँ',
  secContact: 'संपर्क',

  dob: 'जन्म तिथि',
  tob: 'जन्म समय',
  pob: 'जन्म स्थान',
  birthTimePlace: 'जन्म समय और स्थान',
  height: 'ऊँचाई',
  religion: 'धर्म',
  caste: 'जाति',
  motherTongue: 'मातृभाषा',
  nativePlace: 'मूल निवास',
  diet: 'आहार',
  complexion: 'रंग',

  education: 'शिक्षा',
  occupation: 'व्यवसाय',
  employer: 'कार्यस्थल',
  workLocation: 'कार्य स्थान',
  income: 'वार्षिक आय',

  father: 'पिता',
  fatherOccupation: 'पिता का व्यवसाय',
  mother: 'माता',
  motherOccupation: 'माता का व्यवसाय',
  brother: 'भाई',
  sister: 'बहन',
  familyType: 'परिवार का प्रकार',

  rashi: 'राशि',
  nakshatra: 'नक्षत्र',
  gotra: 'गोत्र',
  manglik: 'मांगलिक',
  gan: 'गण',
  nadi: 'नाड़ी',
  charan: 'चरण',

  contactPerson: 'संपर्क व्यक्ति',
  phone: 'मोबाइल',
  altPhone: 'वैकल्पिक मोबाइल',
  email: 'ईमेल',
  address: 'पता',

  dietVegetarian: 'शाकाहारी',
  dietEggetarian: 'अंडाहारी',
  dietNonVegetarian: 'मांसाहारी',
  dietJain: 'जैन',
  dietVegan: 'शुद्ध शाकाहारी',

  manglikNo: 'नहीं',
  manglikYes: 'हाँ',
  manglikPartial: 'आंशिक',
  manglikUnknown: 'ज्ञात नहीं',

  familyNuclear: 'एकल परिवार',
  familyJoint: 'संयुक्त परिवार',

  unitFt: 'फ़ीट',
  unitIn: 'इंच',
  photoPlaceholder: 'फोटो की जगह'
};

const mr: Record<DocLabelKey, string> = {
  kickerBiodata: 'बायोडाटा',
  kickerBride: 'वधू परिचय',
  kickerGroom: 'वर परिचय',
  invocation: '॥ श्री गणेशाय नमः ॥',

  secPersonal: 'वैयक्तिक माहिती',
  secEducation: 'शिक्षण व नोकरी',
  secFamily: 'कौटुंबिक माहिती',
  secHoroscope: 'पत्रिका',
  secAbout: 'माझ्याविषयी',
  secExpectations: 'अपेक्षा',
  secContact: 'संपर्क',

  dob: 'जन्मतारीख',
  tob: 'जन्मवेळ',
  pob: 'जन्मस्थळ',
  birthTimePlace: 'जन्मवेळ व जन्मस्थळ',
  height: 'उंची',
  religion: 'धर्म',
  caste: 'जात',
  motherTongue: 'मातृभाषा',
  nativePlace: 'मूळ गाव',
  diet: 'आहार',
  complexion: 'वर्ण',

  education: 'शिक्षण',
  occupation: 'नोकरी',
  employer: 'कार्यालय',
  workLocation: 'कामाचे ठिकाण',
  income: 'वार्षिक उत्पन्न',

  father: 'वडील',
  fatherOccupation: 'वडिलांचा व्यवसाय',
  mother: 'आई',
  motherOccupation: 'आईचा व्यवसाय',
  brother: 'भाऊ',
  sister: 'बहीण',
  familyType: 'कुटुंब प्रकार',

  rashi: 'रास',
  nakshatra: 'नक्षत्र',
  gotra: 'गोत्र',
  manglik: 'मंगळ',
  gan: 'गण',
  nadi: 'नाडी',
  charan: 'चरण',

  contactPerson: 'संपर्क व्यक्ती',
  phone: 'मोबाइल',
  altPhone: 'पर्यायी मोबाइल',
  email: 'ईमेल',
  address: 'पत्ता',

  dietVegetarian: 'शाकाहारी',
  dietEggetarian: 'अंडी चालतात',
  dietNonVegetarian: 'मांसाहारी',
  dietJain: 'जैन',
  dietVegan: 'पूर्ण शाकाहारी',

  manglikNo: 'नाही',
  manglikYes: 'होय',
  manglikPartial: 'अंशतः',
  manglikUnknown: 'माहीत नाही',

  familyNuclear: 'विभक्त कुटुंब',
  familyJoint: 'एकत्र कुटुंब',

  unitFt: 'फूट',
  unitIn: 'इंच',
  photoPlaceholder: 'फोटोची जागा'
};

export const docLabels = { en, hi, mr } as const;

/** Labels for one document language. */
export function labelsFor(locale: DocLocale): Record<DocLabelKey, string> {
  return docLabels[locale];
}
