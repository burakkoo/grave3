/**
 * POST /api/posts/:postId/approve
 * - Allows an authenticated user to approve a post specified
 * by the :postId.
 */

import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma/prisma';

import { getServerUser } from '@/lib/getServerUser';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;
  const postId = params.postId;

  const hasAccess = await verifyAccessToPost(postId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Unauthorized to approve this post' }, { status: 403 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
        ApprovalStatus: true,
      },
    });

    if (!post || post.userId !== userId) return NextResponse.json({}, { status: 401 });

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ApprovalStatus: true,
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve post' }, { status: 500 });
  }
}
