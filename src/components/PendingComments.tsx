'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { GetComment } from '@/types/definitions';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, type ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';
import { Comment } from './Comment';

interface CustomError extends Error {
  cause?: Error | string | unknown;
}

interface ApprovedCommentResponse {
  id: number;
  postId: number;
  isApproved: boolean;
}

/**
 * Context type for the approve comment mutation
 * Contains the previous state for rollback on error
 */
interface MutationContext {
  previousComments: GetComment[] | undefined;
  comment: GetComment | undefined;
}

export function PendingComments({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const queryKey = ['users', userId, 'pending-comments'];

  // Update the mutation type definition
  const approveCommentMutation = useMutation<
    ApprovedCommentResponse,
    Error,
    number,
    MutationContext
  >({
    mutationFn: async (commentId: number) => {
      try {
        const res = await fetch(`/api/comments/${commentId}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          let errorMessage: string;
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || 'Failed to approve comment';
          } catch {
            errorMessage = `Failed to approve comment: ${res.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        return data;
      } catch (err) {
        console.error('Error approving comment:', err);
        throw err instanceof Error ? err : new Error('Failed to approve comment');
      }
    },
    onMutate: async (commentId) => {
      // Get the current pending comments first
      const previousComments = qc.getQueryData<GetComment[]>(queryKey);
      const comment = previousComments?.find(c => c.id === commentId);

      // Then cancel queries with the correct postId
      await Promise.all([
        qc.cancelQueries({ queryKey }),
        comment && qc.cancelQueries({ 
          queryKey: ['posts', comment.postId, 'comments'] 
        })
      ].filter(Boolean));

      if (previousComments) {
        // Optimistically remove the approved comment from pending list
        qc.setQueryData<GetComment[]>(queryKey, 
          previousComments.filter(c => c.id !== commentId)
        );
      }

      if (comment) {
        // Optimistically add the comment to the post's comments
        const postCommentsKey = ['posts', comment.postId, 'comments'];
        const previousPostComments = qc.getQueryData<GetComment[]>(postCommentsKey);
        
        if (previousPostComments) {
          qc.setQueryData<GetComment[]>(postCommentsKey, [
            ...previousPostComments,
            { ...comment, isApproved: true }
          ]);
        }
      }

      return { previousComments, comment } as MutationContext;
    },
    onError: (err, commentId, context) => {
      if (context?.previousComments) {
        // Restore the previous pending comments state
        qc.setQueryData<GetComment[]>(
          ['users', userId, 'pending-comments'], 
          context.previousComments
        );
      }
      
      if (context?.comment) {
        const postCommentsKey = ['posts', context.comment.postId, 'comments'];
        const previousPostComments = qc.getQueryData<GetComment[]>(postCommentsKey);
        
        if (previousPostComments) {
          // Restore the previous post comments state
          qc.setQueryData<GetComment[]>(
            postCommentsKey,
            previousPostComments
          );
        }
      }
      
      showToast({
        title: `Failed to approve comment: ${err.message}`,
        type: 'error'
      });
    },
    onSuccess: (approvedComment) => {
      // Invalidate affected queries to ensure data consistency
      qc.invalidateQueries({ 
        queryKey: ['users', userId, 'pending-comments'],
        exact: true 
      });

      qc.invalidateQueries({ 
        queryKey: ['posts', approvedComment.postId, 'comments'],
        exact: true
      });

      qc.invalidateQueries({ 
        queryKey: ['posts', approvedComment.postId],
        exact: true
      });

      qc.invalidateQueries({ 
        queryKey: ['posts'],
        exact: false 
      });

      showToast({ 
        title: 'Comment approved successfully', 
        type: 'success' 
      });
    },
  });

  const handleRepliesVisibility = useCallback(
    ({ commentId, shown }: { commentId: number; shown: boolean }) => {
      qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
        if (!oldComments) return oldComments;
        return oldComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, repliesShown: shown }
            : comment
        );
      });
    },
    [qc, queryKey]
  );

  const {
    data: pendingComments,
    isPending,
    isError,
    error,
    refetch
  } = useQuery<GetComment[], CustomError>({
    queryKey,
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${userId}/pending-comments`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch pending comments');
        }
        const comments = await res.json();
        // Only filter out comments that were directly posted by the profile owner
        // Keep comments from other users even if they have PostedBy set
        return comments.filter((comment: GetComment) => 
          comment.user?.id !== userId // Filter out comments where the user is the profile owner
        );
      } catch (err) {
        console.error('Error fetching pending comments:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });

  // Add polling effect like Posts component
  useEffect(() => {
    const interval = setInterval(refetch, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-destructive">
        <p>Error loading pending comments</p>
        <p className="text-sm mt-2">{error.message}</p>
        {error.cause ? (
          <p className="text-xs mt-1 text-muted-foreground">
            {typeof error.cause === 'string' 
              ? error.cause 
              : error.cause instanceof Error 
                ? error.cause.message 
                : 'An unexpected error occurred'}
          </p>
        ) : null}
      </div>
    );
  }

  if (!pendingComments?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No pending comments to approve
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Pending Comments</h2>
      <div className="divide-y divide-border">
        {pendingComments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            setRepliesVisibility={handleRepliesVisibility}
            queryKey={queryKey}
            isOwnComment={session?.user?.id === comment.user?.id}
            profileOwnerId={userId}
            postId={comment.postId}
            onApprove={() => approveCommentMutation.mutate(comment.id)}
          />
        ))}
      </div>
    </div>
  );
} 