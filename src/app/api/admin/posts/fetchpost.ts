// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma/prisma'; // Assuming this is your Prisma client setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true, // To include the user who created the post
        visualMedia: true, // To include related visual media
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
}
