'use client';

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { chunk } from 'lodash';
import { POSTS_PER_PAGE } from '@/constants';
import { useSession } from 'next-auth/react';
import { PostIds } from '@/types/definitions';
import { useErrorNotifier } from '../useErrorNotifier';

export function useDeletePostMutation() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const queryKey = ['users', session?.user.id, 'posts'];
  const { notifyError } = useErrorNotifier();

  const deleteMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post.');
      }

      return (await response.json()) as { id: number };
    },
    onMutate: async ({ postId }) => {
      await qc.cancelQueries({ queryKey });
      const previousData = qc.getQueryData(queryKey);

      qc.setQueryData<InfiniteData<PostIds[]>>(
        queryKey,
        (oldData): InfiniteData<PostIds[]> | undefined => {
          if (!oldData) return undefined;

          const updatedPosts = oldData.pages
            .flat()
            .filter((post) => post.id !== postId);
          
          return {
            pages: [updatedPosts],
            pageParams: oldData.pageParams,
          };
        }
      );

      return { previousData };
    },
    onError: (error, _, context) => {
      qc.setQueryData(queryKey, context?.previousData);
      notifyError(error);
    },
  });

  return { deleteMutation };
}
