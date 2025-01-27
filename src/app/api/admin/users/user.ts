// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma/prisma'; // Assuming this is your Prisma client setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
}
