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

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    const [user] = await getServerUser();
    const userId = user?.id;
    const postId = parseInt(params.postId);

    const body = await request.json();
    console.log('Received body:', body); // Debug log

    const validatedData = commentWriteSchema.parse({
      ...body,
      postId // Add postId to the validation data
    });

    // Check if commenter is profile owner before creating comment
    let isAutoApproved = false;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });

    // Auto-approve if the commenter is the profile owner
    if (userId && post) {
      isAutoApproved = post.userId === userId;
    }
    
    // Create comment with proper null handling
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content.trim(),
        postId,
        userId: userId ?? null, // Use nullish coalescing for cleaner null handling
        PostedBy: validatedData.PostedBy || null,
        Relation: validatedData.Relation || null,
        isApproved: isAutoApproved,
      },
      include: includeToComment(userId),
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
