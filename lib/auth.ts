import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import type { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        autoLoginToken: { label: 'Auto Login Token', type: 'text' },
      },
      async authorize(credentials) {
        // Handle auto-login via token (after email verification)
        if (credentials?.autoLoginToken) {
          const autoLoginToken = await prisma.verificationToken.findUnique({
            where: { token: credentials.autoLoginToken },
          });

          if (!autoLoginToken || autoLoginToken.expires < new Date()) {
            throw new Error('Invalid or expired token');
          }

          const email = autoLoginToken.identifier.replace('autologin:', '');
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.emailVerified) {
            throw new Error('Invalid credentials');
          }

          // Delete the used token
          await prisma.verificationToken.delete({
            where: { token: credentials.autoLoginToken },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        // Handle regular email/password login
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Check if email is verified
        // DISABLED: Email verification temporarily disabled
        // TODO: Re-enable this check when email verification is needed again
        // if (!user.emailVerified) {
        //   throw new Error('UNVERIFIED_EMAIL');
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 365 * 24 * 60 * 60, // 1 year (effectively never expires for user experience)
    updateAge: 24 * 60 * 60, // Update session every 24 hours to keep it alive
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      // For credentials provider, we need to store the user info in the token
      if (account?.provider === 'credentials' && user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
