import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: ['/w/:path*', '/api/private/:path*'], // protect workspaces and any private APIs
};
