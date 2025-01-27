import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { chunk } from 'lodash';
import { useSession } from 'next-auth/react';
import { GetVisualMedia, GetPost } from '@/types/definitions';
import { POSTS_PER_PAGE } from '@/constants';
import { revokeVisualMediaObjectUrls } from '@/lib/revokeVisualMediaObjectUrls';
import { useToast } from '../useToast';
import { useErrorNotifier } from '../useErrorNotifier';

interface PostIds {
  id: number;
  commentsShown: boolean;
}

type PostIdsArray = PostIds[];

const APPROVAL_MESSAGES = {
  post: "Your post has been submitted successfully! To maintain a respectful and appropriate environment, all posts need to be reviewed and approved by the profile owner before they become visible.",
  comment: "Your comment has been submitted successfully! To maintain a respectful and appropriate environment, all comments need to be reviewed and approved by the profile owner before they become visible."
} as const;

export function useWritePostMutations({
  content,
  visualMedia,
  profileId,
  name,
  relation,
  exitCreatePostModal,
}: {
  content: string;
  visualMedia: GetVisualMedia[];
  profileId: string;
  name: string;
  relation: string;
  exitCreatePostModal: () => void;
}) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const queryKey = ['users', profileId, 'posts'];
  const { showToast } = useToast();
  const { notifyError } = useErrorNotifier();

  const generateFormData = async (): Promise<FormData> => {
    const formData = new FormData();
    if (content) formData.append('content', content);

    const visualMediaFilesPromises = visualMedia.map(async ({ url }) => {
      if (url.startsWith('blob:')) {
        // If the url is a blob, fetch the blob and append it to the formData
        const file = await fetch(url).then((r) => r.blob());
        // Generate a unique filename for the blob
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        formData.append('files', file, fileName);
      } else {
        // If the url is a link, just append it to the formData
        formData.append('files', url);
      }
    });

    if (profileId) formData.append('profileId', profileId);
    if (name) formData.append('name', name);
    if (relation) formData.append('relation', relation);

    await Promise.all(visualMediaFilesPromises);

    return formData;
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = await generateFormData();
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create post');
      }

      return res.json() as Promise<GetPost>;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: ['profile', profileId, 'posts'] });
      
      // Show different messages based on whether it's auto-approved
      const isOwnProfile = session?.user?.id === profileId;
      showToast({ 
        title: 'Post submitted!',
        message: isOwnProfile 
          ? 'Your post has been published successfully!'
          : APPROVAL_MESSAGES.post,
        type: 'success',
        duration: 5000
      });

      // Cleanup and close modal
      revokeVisualMediaObjectUrls(visualMedia);
      exitCreatePostModal();
    },
    onError: (error: Error) => {
      showToast({
        title: 'Error creating post',
        message: error.message || 'Failed to create post',
        type: 'error',
        duration: 5000
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: await generateFormData(),
      });

      if (!res.ok) throw new Error(res.statusText);
      // Return the created post to be used by callbacks.
      return (await res.json()) as GetPost;
    },
    onSuccess: (updatedPost) => {
      // Update the query for the updated post
      qc.setQueryData(['posts', updatedPost.id], updatedPost);

      // Update the infinite query data handling
      qc.setQueriesData<InfiniteData<PostIdsArray>>({ queryKey }, (oldData) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page) => 
          page.map((post) => 
            post.id === updatedPost.id 
              ? { id: updatedPost.id, commentsShown: post.commentsShown }
              : post
          )
        );

        return {
          pages: newPages,
          pageParams: oldData.pageParams,
        };
      });
      showToast({ title: 'Successfully Edited', type: 'success' });
      revokeVisualMediaObjectUrls(visualMedia);
      exitCreatePostModal();
    },
    onError: (err) => {
      notifyError(err, 'Error Creating Post');
    },
  });

  return { createPostMutation, updatePostMutation };
}
