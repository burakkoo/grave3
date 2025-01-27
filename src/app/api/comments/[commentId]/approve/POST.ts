import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import { toGetComment } from '@/lib/prisma/toGetComment';

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const [user] = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const commentId = parseInt(params.commentId);

    // Get the comment and associated post
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if the user is the profile owner
    if (user.id !== comment.post.userId) {
      return NextResponse.json({ 
        error: 'Only the profile owner can approve comments' 
      }, { status: 403 });
    }

    // Approve the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { isApproved: true },
      include: includeToComment(user.id),
    });

    const transformedComment = await toGetComment(updatedComment);
    return NextResponse.json(transformedComment);
  } catch (error) {
    console.error('Error approving comment:', error);
    return NextResponse.json(
      { error: 'Failed to approve comment' },
      { status: 500 }
    );
  }
} 