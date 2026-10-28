import type { Biodata, DocLocale } from '@/lib/biodata';
import { emptyBiodata } from '@/lib/biodata';

/**
 * Sample biodata for gallery previews and the "try it with sample details"
 * path. Every person, number and address here is invented. Phone numbers are
 * masked so a preview screenshot cannot leak a real one.
 */

const base = (slug: string, loc: DocLocale): Biodata => emptyBiodata(slug, loc);

export function sampleFor(slug: string, loc: DocLocale): Biodata {
  if (loc === 'mr') {
    return {
      ...base(slug, 'mr'),
      fullName: 'अनन्या प्रकाश कुलकर्णी',
      profileType: 'bride',
      dob: '1997-03-14',
      tob: '06:40',
      pob: 'पुणे',
      heightCm: 163,
      religion: 'हिंदू',
      motherTongue: 'मराठी',
      nativePlace: 'सातारा',
      diet: 'vegetarian',
      education: [{ qualification: 'एम.एस्सी. (डेटा सायन्स)', institution: 'सावित्रीबाई फुले पुणे विद्यापीठ', year: '2020' }],
      occupation: 'वरिष्ठ डेटा विश्लेषक',
      workLocation: 'पुणे',
      showFamily: true,
      fatherName: 'प्रकाश कुलकर्णी',
      fatherOccupation: 'निवृत्त बँक व्यवस्थापक',
      motherName: 'स्मिता कुलकर्णी',
      motherOccupation: 'शिक्षिका',
      siblings: [{ relation: 'brother', name: 'रोहन', note: 'धाकटा, बी.टेक. अंतिम वर्ष' }],
      familyType: 'nuclear',
      showHoroscope: true,
      rashi: 'मेष',
      nakshatra: 'अश्विनी',
      gotra: 'काश्यप',
      manglik: 'no',
      expectations: 'सुशिक्षित, समजूतदार आणि कुटुंबवत्सल जोडीदार. पुणे किंवा मुंबई येथे स्थायिक असल्यास प्राधान्य.',
      contactName: 'प्रकाश कुलकर्णी',
      phone: '+91 98000 00010',
      address: 'कोथरूड, पुणे'
    };
  }
  if (loc === 'hi') {
    return {
      ...base(slug, 'hi'),
      fullName: 'प्रिया रमेश यादव',
      profileType: 'bride',
      dob: '1999-06-12',
      tob: '09:10',
      pob: 'प्रयागराज',
      heightCm: 160,
      religion: 'हिंदू',
      motherTongue: 'हिन्दी',
      nativePlace: 'जौनपुर',
      diet: 'vegetarian',
      education: [{ qualification: 'एम.ए. (हिंदी), बी.एड.', institution: '', year: '' }],
      occupation: 'सरकारी विद्यालय में शिक्षिका',
      workLocation: 'प्रयागराज',
      showFamily: true,
      fatherName: 'श्री रमेश चंद्र यादव',
      fatherOccupation: 'बैंक कर्मचारी',
      motherName: 'श्रीमती सरला यादव',
      motherOccupation: 'गृहिणी',
      siblings: [{ relation: 'brother', name: 'अंकित', note: 'छोटा, इंजीनियरिंग छात्र' }],
      showHoroscope: true,
      gotra: 'कश्यप',
      manglik: 'no',
      about: 'शांत, मिलनसार और परिवार से जुड़ी हुई। पढ़ना, भजन गाना और बागवानी पसंद है।',
      contactName: 'रमेश चंद्र यादव',
      phone: '+91 96000 00034',
      address: 'सिविल लाइंस, प्रयागराज'
    };
  }
  return {
    ...base(slug, 'en'),
    fullName: 'Ananya Prakash Kulkarni',
    profileType: 'bride',
    dob: '1997-03-14',
    tob: '06:40',
    pob: 'Pune',
    heightCm: 163,
    religion: 'Hindu',
    motherTongue: 'Marathi',
    nativePlace: 'Satara, Maharashtra',
    diet: 'vegetarian',
    education: [
      { qualification: 'M.Sc. Data Science', institution: 'Pune University', year: '2020' },
      { qualification: 'B.Sc. Statistics', institution: '', year: '' }
    ],
    occupation: 'Senior Data Analyst',
    employer: 'Healthcare technology',
    workLocation: 'Pune',
    showFamily: true,
    fatherName: 'Prakash Kulkarni',
    fatherOccupation: 'Retired bank manager',
    motherName: 'Smita Kulkarni',
    motherOccupation: 'School teacher',
    siblings: [{ relation: 'brother', name: 'Rohan', note: 'younger, B.Tech final year' }],
    familyType: 'nuclear',
    familyNativePlace: 'Satara, Maharashtra',
    showHoroscope: true,
    rashi: 'Mesh',
    nakshatra: 'Ashwini',
    gotra: 'Kashyap',
    manglik: 'no',
    about: 'Calm, curious and close to family. Enjoys classical music and weekend treks.',
    expectations: 'A kind, well-educated partner who values family. Pune or Mumbai preferred.',
    contactName: 'Prakash Kulkarni',
    phone: '+91 98000 00010',
    address: 'Kothrud, Pune'
  };
}
