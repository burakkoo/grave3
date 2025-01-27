import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { GetComment } from '@/types/definitions';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
): Promise<NextResponse<GetComment[] | { error: string }>> {
  try {
    const [user] = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userPosts = await prisma.post.findMany({
      where: { userId: params.userId },
      select: { id: true }
    });

    const postIds = userPosts.map(post => post.id);

    const pendingComments = await prisma.comment.findMany({
      where: {
        AND: [
          { postId: { in: postIds } },
          { isApproved: false },
          {
            OR: [
              { userId: { not: params.userId } },
              { userId: null }
            ]
          }
        ]
      },
      include: includeToComment(user.id),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const transformedComments = await Promise.all(
      pendingComments.map(comment => toGetComment(comment))
    );

    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending comments' },
      { status: 500 }
    );
  }
} 