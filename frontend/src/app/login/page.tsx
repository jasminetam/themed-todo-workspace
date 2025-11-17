'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-4">
      <button
        className="rounded-skin bg-primary px-4 py-2 text-white"
        onClick={() => signIn('google')}
      >
        Sign in with Google
      </button>
    </main>
  );
}
