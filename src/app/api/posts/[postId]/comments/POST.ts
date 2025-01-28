/**
 * POST /api/posts/:postId/comments
 * - Allows any user to comment on a post specified by the :postId.
 * - If user is authenticated, additional activity tracking is performed.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { commentWriteSchema } from '@/lib/validations/comment';
import { z } from 'zod';
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { Prisma } from '@prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  try {
    const body = await request.json();
    const { content } = commentWriteSchema.parse(body);

    // Keep postId as string, don't parse to number
    const postId = params.postId;

    // Check if user owns the post for auto-approval
    let isAutoApproved = false;
    const post = await prisma.post.findUnique({
      where: { id: postId }, // Use string ID
      select: { userId: true }
    });

    if (post?.userId === userId) {
      isAutoApproved = true;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId, // Use string postId
        isApproved: isAutoApproved,
      },
      include: {
        user: true,
      },
    });

    const transformedComment = await toGetComment(comment);
    return NextResponse.json(transformedComment);

  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: `Validation error: ${error.errors[0]?.message}` },
        { status: 422 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
