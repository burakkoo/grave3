import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const posts = await prisma.post.findMany({
    include: {
      user: true, // To include the user who created the post
      visualMedia: true, // To include related visual media
    },
  });

  return NextResponse.json(posts);
}
