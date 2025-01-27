import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma/prisma';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [], // Add empty providers array or configure your auth providers here
  // ... rest of your auth configuration
}; 