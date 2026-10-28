import { ShowcaseLoader } from '@/components/showcase/showcase-loader';

/**
 * A biodata shown as a printed sheet.
 *
 * Deliberately not part of the buying flow: three.js is heavy, so it is
 * dynamically imported behind a client boundary and loaded only here.
 */
export default function ShowcasePage() {
  return <ShowcaseLoader />;
}
