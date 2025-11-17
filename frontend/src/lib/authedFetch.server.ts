import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Server-only helper:
 * - attaches backendAccessToken as Bearer
 * - defaults to JSON
 * - no-store caching
 */
export async function authedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const session = await getServerSession(authOptions);
  const token = (session as any)?.backendAccessToken;

  const headers = new Headers(init.headers as any);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
    cache: 'no-store',
  });
}
