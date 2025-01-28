'use client';

import { memo } from 'react';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import SvgComment from '@/svg_components/Comment';
import { AnimatePresence, motion } from 'framer-motion';
import { GetPost } from '@/types/definitions';
import { isEqual } from 'lodash';
import SvgHeart from '@/svg_components/Heart';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePostLikesMutations } from '@/hooks/mutations/usePostLikesMutations';
import { ToggleStepper } from './ui/ToggleStepper';
import { Comments } from './Comments';
import { PostVisualMediaContainer } from './PostVisualMediaContainer';
import ProfileBlock from './ProfileBlock';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';
import { PostOptions } from './PostOptions';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/useToast';
import { ButtonNaked } from './ui/ButtonNaked';
import SvgCheck from '@/svg_components/Check';
import SvgX from '@/svg_components/X';
import { useDialogs } from '@/hooks/useDialogs';

interface PostProps {
  id: number;
  commentsShown: boolean;
  toggleComments: (postId: number) => void | Promise<void>;
  commentText: string;
  isPendingPage?: boolean;
}

const LoadingSpinner = () => (
  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
);

export const Post = memo(
  function Post({ id, commentsShown, toggleComments, commentText, isPendingPage = false }: PostProps) {
    const { data: post, isPending } = useQuery<GetPost>({
      queryKey: ['posts', id],
      queryFn: async () => {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        return res.json();
      },
      staleTime: Infinity,
    });

    const { likeMutation, unLikeMutation } = usePostLikesMutations({ postId: Number(id) });
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { confirm } = useDialogs();

    const approveMutation = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/posts/${id}/approve`, {
          method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to approve post');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts', id] });
        
        if (post?.user?.id) {
          queryClient.invalidateQueries({ 
            queryKey: ['users', post.user.id, 'pendingPosts'] 
          });
        }
        
        showToast({ title: 'Post approved successfully', type: 'success' });
      },
      onError: (error: Error) => {
        showToast({ 
          title: 'Failed to approve post', 
          type: 'error' 
        });
      },
    });

    const declineMutation = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/posts/${id}/decline`, {
          method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to decline post');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts', id] });
        
        if (post?.user?.id) {
          queryClient.invalidateQueries({ 
            queryKey: ['users', post.user.id, 'pendingPosts'] 
          });
        }
        
        showToast({ title: 'Post declined successfully', type: 'success' });
      },
      onError: (error: Error) => {
        showToast({ 
          title: 'Failed to decline post', 
          type: 'error' 
        });
      },
    });

    const handleApprove = () => {
      approveMutation.mutate();
    };

    const handleDecline = () => {
      confirm({
        title: 'Decline Post',
        message: 'Are you sure you want to decline this post? This action cannot be undone.',
        onConfirm: () => {
          setTimeout(() => {
            declineMutation.mutate();
          }, 300);
        },
      });
    };

    const handleLike = () => {
      if (!post) return;
      post.isLiked ? unLikeMutation.mutate() : likeMutation.mutate();
    };

    if (isPending || !post) return null;

    return (
      <div className="w-full">
        <div className="overflow-hidden rounded-lg border border-border bg-card h-full flex flex-col mx-auto w-full max-w-2xl">
          {isPendingPage && !post.isApproved && session?.user?.id === post.user.id && (
            <div className="flex items-center justify-between p-1.5 border-b border-border bg-muted/30">
              <span className="text-xs sm:text-sm text-muted-foreground pl-1 shrink-0">Pending</span>
              <div className="flex gap-1">
                <ButtonNaked
                  onPress={handleApprove}
                  className="flex items-center justify-center w-7 h-7 text-primary hover:bg-primary/10 rounded-md"
                  aria-label={approveMutation.isPending ? "Approving post..." : "Approve post"}
                  isDisabled={approveMutation.isPending || declineMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <SvgCheck className="h-3.5 w-3.5" />
                  )}
                </ButtonNaked>
                <ButtonNaked
                  onPress={handleDecline}
                  className="flex items-center justify-center w-7 h-7 text-destructive hover:bg-destructive/10 rounded-md"
                  aria-label={declineMutation.isPending ? "Declining post..." : "Decline post"}
                  isDisabled={declineMutation.isPending || approveMutation.isPending}
                >
                  {declineMutation.isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <SvgX className="h-3.5 w-3.5" />
                  )}
                </ButtonNaked>
              </div>
            </div>
          )}

          <div className="px-2 pt-2">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <ProfileBlock
                  type="post"
                  name={post.user.name}
                  username={post.user.username}
                  time={formatDistanceStrict(new Date(post.createdAt), new Date(), { addSuffix: true })}
                  photoUrl={post.user.profilePhoto ?? ''}
                  PostedBy={post.PostedBy ?? undefined}
                  Relation={post.Relation ?? undefined}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 px-2 pb-2 flex-grow">
            {post.content && (
              <div className="break-words text-sm">
                <HighlightedMentionsAndHashTags content={post.content} />
              </div>
            )}

            {commentText && (
              <div className="mt-2 w-full">
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                    {commentText}
                  </p>
                </div>
              </div>
            )}

            {post.visualMedia && post.visualMedia.length > 0 && (
              <div className="w-full">
                <PostVisualMediaContainer 
                  visualMedia={post.visualMedia} 
                  profileId={post.user.id}
                  userId={session?.user?.id ?? ''}
                  autoPlay={false}
                  muted={true}
                  controls={true}
                />
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-border px-1 py-1 sm:px-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <ToggleStepper
                  isSelected={post.isLiked}
                  quantity={post._count.postLikes}
                  Icon={SvgHeart}
                  onChange={handleLike}
                />
                <ToggleStepper
                  isSelected={commentsShown}
                  quantity={post._count.comments}
                  Icon={SvgComment}
                  onChange={() => toggleComments(id)}
                />
              </div>
              <PostOptions 
                postId={Number(id)} 
                content={post.content} 
                visualMedia={post.visualMedia}
                profileId={post.user.id}
                userId={post.user.id}
              />
            </div>

            <AnimatePresence>
              {commentsShown && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-border">
                  <div className="p-2">
                    <Comments 
                      postId={Number(id)} 
                      profileOwnerId={post.user.id}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);

Post.displayName = 'Post';
