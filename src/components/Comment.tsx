'use client';

import { GetComment } from '@/types/definitions';
import { memo } from 'react';
import { isEqual } from 'lodash';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { useSession } from 'next-auth/react';
import { ButtonNaked } from './ui/ButtonNaked';
import SvgTrash from '@/svg_components/Trash';
import { useDeleteCommentMutation } from '@/hooks/mutations/useDeleteCommentMutation';
import SvgCheck from '@/svg_components/Check';

export interface CommentProps extends GetComment {
  queryKey: (string | number)[];
  isOwnComment?: boolean;
  profileOwnerId: string;
  postId: number;
  onApprove?: () => void;
}

export const Comment = memo(
  function Comment({
    id,
    content,
    createdAt,
    user: author,
    PostedBy,
    Relation,
    profileOwnerId,
    postId,
    isApproved,
    onApprove,
  }: CommentProps) {
    const { data: session } = useSession();
    const { deleteCommentMutation } = useDeleteCommentMutation();
    
    const canDelete = session?.user?.id === profileOwnerId;

    console.log('Comment render:', {
      commentId: id,
      profileOwnerId,
      sessionUserId: session?.user?.id,
      canDelete
    });

    const handleDelete = () => {
      if (confirm('Are you sure you want to delete this comment?')) {
        console.log('Deleting comment with ID:', id, 'from post:', postId);
        deleteCommentMutation.mutate(
          { commentId: id, postId },
          {
            onSuccess: () => {
              console.log('Comment deleted successfully');
            },
            onError: (error: Error) => {
              console.error('Failed to delete comment:', error);
            }
          }
        );
      }
    };

    return (
      <div className="flex py-2">
        <div className="flex-1">
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <div className="mb-1 flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">
                    {author?.name || PostedBy || 'Anonymous'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceStrict(new Date(createdAt), new Date(), { addSuffix: true })}
                  </span>
                </div>
                {Relation && (
                  <div className="text-xs text-muted-foreground">
                    <span>Relation: <span className="font-medium">{Relation}</span></span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {onApprove && (
                  <ButtonNaked
                    onPress={onApprove}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-full"
                    aria-label="Approve comment"
                  >
                    <SvgCheck className="h-4 w-4" />
                    <span>Approve</span>
                  </ButtonNaked>
                )}
                {canDelete && (
                  <ButtonNaked
                    onPress={handleDelete}
                    className="text-destructive hover:text-destructive/80 p-1"
                    aria-label="Delete comment"
                    isDisabled={deleteCommentMutation.isPending}
                  >
                    <SvgTrash className={`h-4 w-4 ${deleteCommentMutation.isPending ? 'opacity-50' : ''}`} />
                  </ButtonNaked>
                )}
              </div>
            </div>
            <p className="text-sm">
              {content}
            </p>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);

Comment.displayName = 'Comment';
