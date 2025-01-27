import { Prisma } from '@prisma/client';
import { GetComment } from '@/types/definitions';

type CommentWithIncludes = Prisma.CommentGetPayload<{
  include: {
    user: true;
    commentLikes: {
      include: {
        user: true;
      };
    };
    replies: {
      include: {
        user: true;
        commentLikes: {
          include: {
            user: true;
          };
        };
        _count: {
          select: {
            commentLikes: true,
            replies: true
          };
        };
      };
    };
    _count: {
      select: {
        commentLikes: true;
        replies: true;
      };
    };
  };
}>;

export async function toGetComment(comment: CommentWithIncludes): Promise<GetComment> {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    userId: comment.userId || null,
    postId: comment.postId,
    parentId: comment.parentId,
    PostedBy: comment.PostedBy || null,
    Relation: comment.Relation || null,
    isApproved: comment.isApproved,
    user: comment.user ? {
      id: comment.user.id,
      name: comment.user.name ?? 'Unknown User',
      username: comment.user.username ?? 'unknown',
      profilePhoto: comment.user.profilePhoto,
    } : null,
    _count: {
      commentLikes: comment._count.commentLikes || 0,
      replies: comment._count.replies,
    },
    isLiked: comment.commentLikes?.length > 0,
    replies: comment.replies
      ? await Promise.all(
          comment.replies.map(async (reply) => ({
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt.toISOString(),
            userId: reply.userId || null,
            postId: reply.postId,
            parentId: reply.parentId,
            PostedBy: reply.PostedBy || null,
            Relation: reply.Relation || null,
            isApproved: reply.isApproved,
            user: reply.user ? {
              id: reply.user.id,
              name: reply.user.name ?? 'Unknown User',
              username: reply.user.username ?? 'unknown',
              profilePhoto: reply.user.profilePhoto,
            } : null,
            _count: {
              commentLikes: reply._count?.commentLikes || 0,
              replies: reply._count?.replies || 0
            },
            isLiked: reply.commentLikes?.length > 0,
          }))
        )
      : [],
  };
}
