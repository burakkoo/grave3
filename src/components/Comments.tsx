'use client';

import { useCallback, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GetComment } from '@/types/definitions';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getComments } from '@/lib/client_data_fetching/getComments';
import { useSession } from 'next-auth/react';
import { useShouldAnimate } from '@/hooks/useShouldAnimate';
import { commentFramerVariants } from '@/lib/framerVariants';
import { useToast } from '@/hooks/useToast';
import { CommentCreate } from './CommentCreate';
import { Comment } from './Comment';

const APPROVAL_MESSAGES = {
  post: "Your post has been submitted successfully! It will be visible once approved by the profile owner.",
  comment: "Your comment has been submitted successfully! It will be visible once approved by the profile owner."
} as const;

export function Comments({ postId, profileOwnerId }: { postId: number; profileOwnerId: string }) {
  const qc = useQueryClient();
  const queryKey = useMemo(() => ['posts', postId, 'comments'], [postId]);
  const { data: session } = useSession();
  const { shouldAnimate } = useShouldAnimate();
  const { showToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const approveCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await fetch(`/api/comments/${commentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to approve comment');
      }
      return res.json();
    },
    onMutate: async (commentId) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey });

      // Get current comments
      const previousComments = qc.getQueryData<GetComment[]>(queryKey);

      if (previousComments) {
        // Optimistically update the comment's approval status
        qc.setQueryData<GetComment[]>(queryKey, 
          previousComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, isApproved: true }
              : comment
          )
        );
      }

      return { previousComments };
    },
    onError: (err, commentId, context) => {
      // Roll back on error
      if (context?.previousComments) {
        qc.setQueryData(queryKey, context.previousComments);
      }
      showToast({ 
        title: `Failed to approve comment: ${err.message}`,
        type: 'error' 
      });
    },
    onSuccess: (approvedComment) => {
      // Invalidate the comments query
      qc.invalidateQueries({ queryKey });

      // Invalidate pending comments for the specific user
      qc.invalidateQueries({ 
        queryKey: ['users', profileOwnerId, 'pending-comments'],
        exact: true
      });

      // Invalidate the post itself to update comment counts
      qc.invalidateQueries({ 
        queryKey: ['posts', postId],
        exact: true
      });

      // Invalidate all posts to update comment counts in lists
      qc.invalidateQueries({ 
        queryKey: ['posts'],
        exact: false 
      });

      showToast({ title: 'Comment approved successfully', type: 'success' });
    },
  });

  const handleApproveComment = useCallback((commentId: number) => {
    approveCommentMutation.mutate(commentId);
  }, [approveCommentMutation]);

  const {
    data: comments,
    isPending,
    isError,
    error,
    refetch
  } = useQuery<GetComment[], Error>({
    queryKey,
    queryFn: async () => {
      try {
        const result = await getComments({ postId });
        return result;
      } catch (err) {
        console.error('Error fetching comments:', err);
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

  // Filter comments based on approval status and user role
  const visibleComments = useMemo(() => {
    if (!comments) return [];
    return comments.filter(comment => 
      comment.isApproved || // Show approved comments to everyone
      session?.user?.id === profileOwnerId || // Show all comments to profile owner
      comment.user?.id === profileOwnerId // Show profile owner's comments to everyone
    );
  }, [comments, session?.user?.id, profileOwnerId]);

  const createCommentMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create comment');
      }

      return response.json();
    },
    onMutate: async ({ content }) => {
      await qc.cancelQueries({ queryKey });
      const previousComments = qc.getQueryData<GetComment[]>(queryKey);
      
      if (previousComments && session?.user) {
        const optimisticComment = {
          id: Date.now(),
          content,
          createdAt: new Date().toISOString(),
          userId: session.user.id,
          postId,
          user: {
            id: session.user.id,
            name: session.user.name || '',
            username: session.user.name || ''
          },
          PostedBy: session.user.name || '',
          Relation: null,
          isApproved: session.user.id === profileOwnerId
        } as GetComment;
        
        qc.setQueryData<GetComment[]>(queryKey, [...previousComments, optimisticComment]);
      }
      
      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        qc.setQueryData(queryKey, context.previousComments);
      }
      showToast({
        title: 'Error',
        message: err.message || 'Failed to submit comment',
        type: 'error'
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      showToast({ 
        title: 'Comment submitted!',
        message: session?.user?.id === profileOwnerId 
          ? 'Your comment has been published successfully!'
          : APPROVAL_MESSAGES.comment,
        type: 'success'
      });
      
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    },
  });

  return (
    <div>
      <div className="flex flex-col pt-2">
        {isError ? (
          <div className="py-2 text-destructive">
            Error loading comments: {error.message}
            <button 
              onClick={() => refetch()}
              className="ml-2 text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : isPending ? (
          <div className="flex items-center gap-2 py-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading comments...
          </div>
        ) : visibleComments.length > 0 ? (
          <AnimatePresence>
            {visibleComments.map((comment) => (
              <motion.div
                key={`posts-${postId}-comments-${comment.id}`}
                variants={commentFramerVariants}
                initial={shouldAnimate ? 'start' : false}
                animate="animate"
                exit="exit">
                <Comment
                  {...comment}
                  queryKey={queryKey}
                  isOwnComment={comment.user ? session?.user?.id === comment.user.id : false}
                  profileOwnerId={profileOwnerId}
                  postId={postId}
                  onApprove={
                    !comment.isApproved && session?.user?.id === profileOwnerId
                      ? () => handleApproveComment(comment.id)
                      : undefined
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p className="py-2 text-muted-foreground">Be the first to comment.</p>
        )}
      </div>
      <CommentCreate postId={postId} />
    </div>
  );
}
