'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InfiniteData } from '@tanstack/react-query';
import { chunk } from 'lodash';
import { POSTS_PER_PAGE } from '@/constants';
import { useSession } from 'next-auth/react';
import { PostIds, PostIdsArray } from '@/types/definitions';
import { useErrorNotifier } from '../useErrorNotifier';

export function useDeletePostMutation() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const queryKey = ['users', session?.user.id, 'posts'];
  const { notifyError } = useErrorNotifier();

  const deleteMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      return postId;
    },
    onSuccess: (deletedPostId) => {
      // Update all post-related queries that might contain this post
      qc.invalidateQueries({ queryKey: ['posts', deletedPostId] });

      // Update any infinite queries that might contain this post
      const possibleQueries = qc.getQueriesData<InfiniteData<PostIdsArray>>({
        predicate: (query) => {
          // Match queries that start with 'posts' or contain 'posts' in their key
          const queryKey = query.queryKey;
          return (
            queryKey[0] === 'posts' || 
            (Array.isArray(queryKey) && queryKey.includes('posts'))
          );
        },
      });

      // Update each matching query's cache
      possibleQueries.forEach(([queryKey, oldData]) => {
        if (!oldData?.pages) return;

        qc.setQueryData<InfiniteData<PostIdsArray>>(queryKey, (old) => {
          if (!old?.pages) return old;

          // Remove the deleted post from all pages
          const newPages = old.pages.map(page => 
            Array.isArray(page) ? page.filter(post => post.id !== deletedPostId) : []
          ).filter(page => page.length > 0); // Remove empty pages

          if (newPages.length === 0) {
            return {
              pages: [],
              pageParams: []
            };
          }

          // Flatten and rechunk to maintain consistent page sizes
          const flattened = newPages.flat();
          const rechunked = chunk(flattened, POSTS_PER_PAGE);

          return {
            pages: rechunked,
            pageParams: old.pageParams.slice(0, rechunked.length)
          };
        });
      });
    },
    onError: (error) => {
      notifyError(error);
    },
  });

  return { deleteMutation };
}
