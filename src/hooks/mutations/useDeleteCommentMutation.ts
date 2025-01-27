'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

type DeleteCommentData = {
  commentId: number;
  postId: number;
};

export function useDeleteCommentMutation() {
  const qc = useQueryClient();
  const { showToast } = useToast();

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }: DeleteCommentData) => {
      console.log('Deleting comment:', commentId);

      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Delete comment error:', data);
        throw new Error(data.error || 'Failed to delete comment');
      }

      return data;
    },
    onSuccess: (_, { postId }) => {
      // Invalidate only the specific post's comments
      qc.invalidateQueries({
        queryKey: ['posts', postId, 'comments'],
      });
      showToast({ 
        title: 'Comment deleted successfully', 
        type: 'success' 
      });
    },
    onError: (error: Error) => {
      console.error('Delete mutation error:', error);
      showToast({ 
        title: 'Failed to delete comment', 
        message: error.message,
        type: 'error' 
      });
    },
  });

  return { deleteCommentMutation };
} 