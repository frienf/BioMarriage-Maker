import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, the print page (loaded by the PDF renderer
  // with no locale prefix) and static files.
  matcher: ['/((?!api|print|_next|_vercel|.*\..*).*)']
};
