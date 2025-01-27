import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId);
    const [user] = await getServerUser();

    // Delete the PostLike record
    await prisma.postLike.deleteMany({
      where: {
        postId,
        userId: user?.id || { startsWith: 'anon_' }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unliking post:', error);
    return NextResponse.json(
      { error: 'Failed to unlike post' },
      { status: 500 }
    );
  }
} 