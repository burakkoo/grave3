import { Prisma } from '@prisma/client';

export function includeToComment(userId?: string) {
  return {
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
  } satisfies Prisma.CommentInclude;
}
