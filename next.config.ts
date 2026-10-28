import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const config: NextConfig = {
  // The PDF renderer loads /print/<token> from this same server with Playwright.
  serverExternalPackages: ['playwright', 'postgres']
};

export default withNextIntl(config);
