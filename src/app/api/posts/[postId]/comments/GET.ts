/**
 * GET /api/posts/:postId/comments
 * - Returns the comments of a post specified by the :postId.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { GetComment } from '@/types/definitions';
import { getServerUser } from '@/lib/getServerUser';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { selectComment } from '@/lib/prisma/selectComment';

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  try {
    const [user] = await getServerUser();
    const postId = parseInt(params.postId);

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only fetch top-level comments
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        commentLikes: {
          include: {
            user: true,
          },
        },
        replies: {
          include: {
            user: true,
            commentLikes: {
              include: {
                user: true,
              },
            },
            _count: {
              select: {
                commentLikes: true,
                replies: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            commentLikes: true,
            replies: true,
          },
        },
      },
    });

    const transformedComments: GetComment[] = await Promise.all(comments.map(toGetComment));
    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
