import { Post } from '@/components/Post';
import { includeUserSummary } from './includeUserSummary';

export function selectPost(userId?: string) {
  return {
    id: true,
    content: true,
    createdAt: true,
    ...includeUserSummary(),
    visualMedia: {
      select: {
        id: true,
        type: true,
        fileName: true,
        uploadedAt: true,
        userId: true,
        postId: true,
      },
    },
    PostedBy: true,
    Relation: true,
    /**
     * Use postLikes to store the <PostLike>'s id of the user to the Post.
     * If there is a <PostLike> id, that means the user requesting has
     * liked the Post.
     */
    postLikes: {
      select: {
        id: true,
      },
      where: {
        userId,
      },
    },
    _count: {
      select: {
        postLikes: true,
        comments: true,
      },
    },
  };
}
