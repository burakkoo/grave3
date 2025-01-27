'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetComment } from '@/types/definitions';

type CreateCommentData = {
  postId: number;
  content: string;
  PostedBy: string;
  Relation: string | null;
}

export function useCreateCommentMutations() {
  const qc = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const res = await fetch(`/api/posts/${data.postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create comment');
      }

      return res.json() as Promise<GetComment>;
    },
    onSuccess: (newComment) => {
      // Invalidate and refetch comments for this post
      qc.invalidateQueries({
        queryKey: ['posts', newComment.postId, 'comments'],
      });
    },
  });

  return { createCommentMutation };
}
