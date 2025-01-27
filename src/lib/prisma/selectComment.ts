import { Prisma } from '@prisma/client';

export function selectComment(userId?: string) {
  return {
    id: true,
    content: true,
    createdAt: true,
    userId: true,
    postId: true,
    parentId: true,
    user: {
      select: {
        id: true,
        name: true,
        username: true,
        profilePhoto: true,
      },
    },
    _count: {
      select: {
        commentLikes: true,
        replies: true,
      },
    },
    commentLikes: userId
      ? {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        }
      : false,
    replies: {
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePhoto: true,
          },
        },
        _count: {
          select: {
            commentLikes: true,
          },
        },
        commentLikes: userId
          ? {
              where: {
                userId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: 'asc',
      },
    },
  } satisfies Prisma.CommentSelect;
} 