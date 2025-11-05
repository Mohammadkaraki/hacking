export { default } from 'next-auth/middleware';

// Protect these routes - require authentication
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:id/download',
    '/api/purchases/:path*',
    '/api/downloads/:path*',
  ],
};
