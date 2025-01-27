import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';

export async function POST(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const [user] = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const commentId = parseInt(params.commentId);
    
    if (isNaN(commentId)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    // Get the comment to check if it exists and get its postId
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if the user is the post owner
    if (comment.post.userId !== user.id) {
      return NextResponse.json({ 
        error: 'Unauthorized - Only the post owner can approve comments'
      }, { status: 403 });
    }

    // Update the comment to approved status
    const approvedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { isApproved: true },
      select: {
        id: true,
        postId: true,
        isApproved: true
      }
    });

    return NextResponse.json(approvedComment);
  } catch (error) {
    console.error('Error approving comment:', error);
    return NextResponse.json(
      { error: 'Failed to approve comment' },
      { status: 500 }
    );
  }
} 