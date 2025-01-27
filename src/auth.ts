import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    user: { id: string; name: string }; // Added email to session
  }
}

// Define the Credentials type
interface Credentials {
  email: string;
  password: string;
  qrCode?: string;
}

export const {
  auth,
  handlers: { GET, POST },
  signIn,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials: Partial<Credentials> | undefined, req) {
        console.log('credentials', credentials);
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const { email, password, qrCode } = credentials;

        console.log('email', email);

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Handle QR code validation and association
          let qrCodeRecord = null;
          if (qrCode) {
            qrCodeRecord = await prisma.qRCode.findUnique({
              where: { code: qrCode },
            });

            if (!qrCodeRecord || qrCodeRecord.used) {
              throw new Error('Invalid or already used QR code');
            }
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              qrCode: qrCodeRecord
                ? {
                    connect: { code: qrCodeRecord.code },
                  }
                : undefined,
            },
          });

          if (qrCodeRecord) {
            // Mark the QR code as used
            await prisma.qRCode.update({
              where: { code: qrCodeRecord.code },
              data: { used: true },
            });
          }
        } else {
          const isValidPassword = await bcrypt.compare(password, user.password!);
          if (!isValidPassword) {
            return null;
          }
        }

        return { id: user.id };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    ...authConfig.callbacks,
    session({ token, user, ...rest }) {
      return {
        user: {
          id: token.sub!,
        },
        expires: rest.session.expires,
      };
    },
    async redirect({ url, baseUrl }) {
      // If `url` is not the baseUrl, redirect to `url`
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Otherwise, redirect to the base URL
      return baseUrl;
    },
  },
});
