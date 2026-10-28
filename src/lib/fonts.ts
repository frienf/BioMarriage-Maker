/**
 * Every typeface the design canvas uses, self-hosted by next/font.
 *
 * Self-hosting matters twice over: the PDF renderer must not depend on a
 * network call to Google Fonts mid-render, and a missing Devanagari face is
 * what turns a conjunct into a box on someone's printed biodata.
 */
import {
  Eczar,
  Mukta,
  Martel,
  Tiro_Devanagari_Hindi,
  Tiro_Devanagari_Marathi,
  Poppins,
  Hind,
  Rozha_One,
  Laila,
  Yatra_One,
  Khand,
  Sura,
  Kurale,
  Sarpanch,
  Vesper_Libre
} from 'next/font/google';

// next/font needs literal arguments: no spreads, no shared constants.
// Site chrome
export const eczar = Eczar({ subsets: ['latin', 'devanagari'], weight: ['500', '600', '700'], variable: '--font-eczar', display: 'swap' });
export const mukta = Mukta({ subsets: ['latin', 'devanagari'], weight: ['300', '400', '500', '600', '700'], variable: '--font-mukta', display: 'swap' });

// Template faces
export const martel = Martel({ subsets: ['latin', 'devanagari'], weight: ['300', '400', '600', '700'], variable: '--font-martel', display: 'swap' });
export const tiroHi = Tiro_Devanagari_Hindi({ subsets: ['latin', 'devanagari'], weight: ['400'], style: ['normal', 'italic'], variable: '--font-tiro-hi', display: 'swap' });
export const tiroMr = Tiro_Devanagari_Marathi({ subsets: ['latin', 'devanagari'], weight: ['400'], variable: '--font-tiro-mr', display: 'swap' });
export const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-poppins', display: 'swap' });
export const hind = Hind({ subsets: ['latin', 'devanagari'], weight: ['400', '500', '600'], variable: '--font-hind', display: 'swap' });
export const rozha = Rozha_One({ subsets: ['latin', 'devanagari'], weight: ['400'], variable: '--font-rozha', display: 'swap' });
export const laila = Laila({ subsets: ['latin', 'devanagari'], weight: ['400', '500', '600'], variable: '--font-laila', display: 'swap' });
export const yatra = Yatra_One({ subsets: ['latin', 'devanagari'], weight: ['400'], variable: '--font-yatra', display: 'swap' });
export const khand = Khand({ subsets: ['latin', 'devanagari'], weight: ['500', '600'], variable: '--font-khand', display: 'swap' });
export const sura = Sura({ subsets: ['latin', 'devanagari'], weight: ['400', '700'], variable: '--font-sura', display: 'swap' });
export const kurale = Kurale({ subsets: ['latin', 'devanagari'], weight: ['400'], variable: '--font-kurale', display: 'swap' });
export const sarpanch = Sarpanch({ subsets: ['latin', 'devanagari'], weight: ['600'], variable: '--font-sarpanch', display: 'swap' });
export const vesper = Vesper_Libre({ subsets: ['latin', 'devanagari'], weight: ['500', '700'], variable: '--font-vesper', display: 'swap' });

/** Site chrome only. Pages that never show a template stay light. */
export const siteFontClass = [eczar.variable, mukta.variable].join(' ');

/** Everywhere a template can appear: gallery, editor preview, print page. */
export const templateFontClass = [
  eczar.variable,
  mukta.variable,
  martel.variable,
  tiroHi.variable,
  tiroMr.variable,
  poppins.variable,
  hind.variable,
  rozha.variable,
  laila.variable,
  yatra.variable,
  khand.variable,
  sura.variable,
  kurale.variable,
  sarpanch.variable,
  vesper.variable
].join(' ');
