import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

/**
 * One pool per process. Next reloads modules in development, so it is cached
 * on globalThis to avoid opening a new pool on every save.
 */
const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local.');
  globalForDb.__sql ??= postgres(url, { max: 10 });
  return globalForDb.__sql;
}

export function getDb() {
  return drizzle(client(), { schema });
}

export { schema };
