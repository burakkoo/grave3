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

    // Get the post to check if it exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Create a new PostLike record
    const newLike = await prisma.postLike.create({
      data: {
        postId,
        userId: user?.id || `anon_${Math.random().toString(36).slice(2)}`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
} 