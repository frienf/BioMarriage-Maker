/** The eight deities the devotional collection draws. Kept out of the .tsx so
 *  the catalogue and its tests can read it without a JSX parser. */
export const MOTIFS = ['ganesh', 'om', 'krishna', 'shiv', 'lakshmi', 'ram', 'hanuman', 'saraswati', 'mahadev', 'durga', 'ambabai', 'vitthal', 'balaji', 'khandoba'] as const;

export type Motif = (typeof MOTIFS)[number];
