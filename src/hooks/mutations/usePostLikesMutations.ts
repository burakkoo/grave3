'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetPost } from '@/types/definitions';

export function usePostLikesMutations({ postId }: { postId: number }) {
  const qc = useQueryClient();
  const queryKey = ['posts', postId];

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw Error('Error liking post.');
      }
      return true;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey });
      const previousPost = qc.getQueryData(queryKey);

      qc.setQueryData<GetPost>(queryKey, (oldPost) => {
        if (!oldPost) return;
        return {
          ...oldPost,
          _count: {
            ...oldPost._count,
            postLikes: oldPost._count.postLikes + 1,
          },
          isLiked: true,
        };
      });

      return { previousPost };
    },
    onError: (err, variables, context) => {
      qc.setQueryData(queryKey, context?.previousPost);
    },
  });

  const unLikeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${postId}/unlike`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw Error('Error unliking post.');
      }
      return true;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey });
      const previousPost = qc.getQueryData(queryKey);

      qc.setQueryData<GetPost>(queryKey, (oldPost) => {
        if (!oldPost) return;
        return {
          ...oldPost,
          _count: {
            ...oldPost._count,
            postLikes: oldPost._count.postLikes - 1,
          },
          isLiked: false,
        };
      });

      return { previousPost };
    },
    onError: (err, variables, context) => {
      qc.setQueryData(queryKey, context?.previousPost);
    },
  });

  return { likeMutation, unLikeMutation };
}
