import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const [user] = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const commentId = parseInt(params.commentId);

    // First get the comment to find the post ID
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        postId: true,
        userId: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Then get the post to check ownership
    const post = await prisma.post.findUnique({
      where: { id: comment.postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Allow deletion if user is either:
    // 1. The owner of the comment
    // 2. The owner of the post
    const canDelete = user.id === comment.userId || user.id === post.userId;

    if (!canDelete) {
      return NextResponse.json({ 
        error: 'Unauthorized - Only the comment owner or post owner can delete comments'
      }, { status: 403 });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
