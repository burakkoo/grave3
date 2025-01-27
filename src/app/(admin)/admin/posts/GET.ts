import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const postsWithTimestamps = await prisma.post.findMany({
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc', // Optional: Sort by creation date in descending order
    },
  });

  return NextResponse.json(postsWithTimestamps);
}
