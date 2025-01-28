import { Prisma } from '@prisma/client';
import { GetComment } from '@/types/definitions';

type CommentWithIncludes = Prisma.CommentGetPayload<{
  include: {
    user: true;
  };
}>;

export async function toGetComment(comment: CommentWithIncludes): Promise<GetComment> {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    userId: comment.userId || null,
    postId: comment.postId,
    PostedBy: comment.PostedBy || null,
    Relation: comment.Relation || null,
    isApproved: comment.isApproved,
    user: comment.user ? {
      id: comment.user.id,
      name: comment.user.name ?? 'Unknown User',
      username: comment.user.username ?? 'unknown'
    } : null
  };
}
