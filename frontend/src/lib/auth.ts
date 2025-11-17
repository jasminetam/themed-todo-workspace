import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      // First sign-in or provider change -> exchange with backend
      if (account && token.email) {
        try {
          const res = await fetch(`${process.env.API_BASE}/auth/exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: token.email,
              name: (profile as any)?.name ?? token.name ?? null,
              avatarUrl: (profile as any)?.picture ?? (profile as any)?.avatar_url ?? null,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            (token as any).backendAccessToken = data.accessToken;
            (token as any).backendAccessExp = data.expiresAt ?? null;
          } else {
            console.error('Exchange failed', await res.text());
          }
        } catch (e) {
          console.error('Exchange error', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).backendAccessToken = (token as any).backendAccessToken ?? null;
      (session as any).backendAccessExp = (token as any).backendAccessExp ?? null;
      return session;
    },
  },
};

export const nextAuthHandler = NextAuth(authOptions);
