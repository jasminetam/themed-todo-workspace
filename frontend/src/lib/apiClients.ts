import { getServerSession } from 'next-auth';
import 'server-only';

export async function apiFetch(input: string, init?: RequestInit) {
  const session = await getServerSession(); // server components/route handlers
  const headers = new Headers(init?.headers);

  const token = (session as any)?.backendAccessToken;
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return fetch(`${process.env.API_BASE}${input}`, { ...init, headers, cache: 'no-store' });
}
