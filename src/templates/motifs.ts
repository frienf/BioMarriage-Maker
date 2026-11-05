/** The eight deities the devotional collection draws. Kept out of the .tsx so
 *  the catalogue and its tests can read it without a JSX parser. */
export const MOTIFS = ['ganesh', 'om', 'krishna', 'shiv', 'trinetra', 'lakshmi', 'ram', 'hanuman', 'saraswati', 'mahadev', 'durga', 'ambabai', 'vitthal', 'balaji', 'khandoba', 'narayan', 'murugan', 'shankha', 'surya', 'simha', 'brahma', 'jagannath', 'aditya', 'annapurna', 'kamadeva'] as const;

export type Motif = (typeof MOTIFS)[number];
