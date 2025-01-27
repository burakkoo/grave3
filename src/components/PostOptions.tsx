import { useDialogs } from '@/hooks/useDialogs';
import { GetVisualMedia } from '@/types/definitions';
import { useCallback } from 'react';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import { useDeletePostMutation } from '@/hooks/mutations/useDeletePostMutation';
import { useSession } from 'next-auth/react';
import { ButtonNaked } from './ui/ButtonNaked';
import SvgEdit from '@/svg_components/Edit';
import SvgDelete from '@/svg_components/Delete';

// Add custom type for session user
interface SessionUser {
  id: string;
  name: string;
  role?: 'USER' | 'ADMIN';  // Add role to the type
}

export function PostOptions({
  postId,
  content,
  visualMedia,
  profileId,
  userId,
}: {
  postId: number;
  content: string | null;
  visualMedia?: GetVisualMedia[];
  profileId: string;
  userId: string;
}) {
  const { confirm } = useDialogs();
  const { launchEditPost } = useCreatePostModal();
  const { deleteMutation } = useDeletePostMutation();
  const { data: session } = useSession();

  const isProfileOwner = session?.user?.id === profileId;
  // Type assertion for session user
  const isAdmin = (session?.user as SessionUser | undefined)?.role === 'ADMIN';

  const handleDeleteClick = useCallback(() => {
    confirm({
      title: 'Delete Post',
      message: 'Do you really wish to delete this post?',
      onConfirm: () => {
        setTimeout(() => deleteMutation.mutate({ postId }), 300);
      },
    });
  }, [confirm, deleteMutation, postId]);

  const handleEditClick = useCallback(() => {
    launchEditPost({
      postId,
      initialContent: content ?? '',
      initialVisualMedia: visualMedia ?? [],
    });
  }, [launchEditPost, postId, content, visualMedia]);

  if (!isProfileOwner && !isAdmin) return null;

  return (
    <div className="flex flex-shrink-0 gap-1 sm:gap-2">
      {isProfileOwner && (
        <ButtonNaked
          onPress={handleEditClick}
          className="group flex items-center gap-1 p-1 text-muted-foreground hover:text-foreground sm:gap-2 sm:p-2"
          aria-label="Edit post">
          <SvgEdit className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm">Edit</span>
        </ButtonNaked>
      )}
      <ButtonNaked
        onPress={handleDeleteClick}
        className="group flex items-center gap-1 p-1 text-destructive hover:text-destructive/80 sm:gap-2 sm:p-2"
        aria-label="Delete post">
        <SvgDelete className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm">Delete</span>
      </ButtonNaked>
    </div>
  );
}
