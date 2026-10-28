import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hi', 'mr'],
  defaultLocale: 'en',
  // Always prefix, so /hi and /mr are real URLs a family can bookmark and
  // share, and so the document language is never guessed from a header.
  localePrefix: 'always'
});

export type AppLocale = (typeof routing.locales)[number];
