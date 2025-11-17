'use client';

import { getSession } from 'next-auth/react';

export async function authedFetchClient(input: RequestInfo | URL, init: RequestInit = {}) {
  const session = await getSession();
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
  });
}
