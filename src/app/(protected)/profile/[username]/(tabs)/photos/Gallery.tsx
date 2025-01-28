'use client';

import { GetVisualMedia } from '@/types/definitions';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { useSession } from 'next-auth/react';
import { useDialogs } from '@/hooks/useDialogs';
import { useToast } from '@/hooks/useToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ButtonNaked } from '@/components/ui/ButtonNaked';
import SvgTrash from '@/svg_components/Trash';
import { useEffect, useState } from 'react';
import { GalleryItem } from './GalleryItem';

interface GalleryProps {
  visualMedia: GetVisualMedia[];
  profileId: string;
}

export function Gallery({ visualMedia: initialVisualMedia, profileId }: GalleryProps) {
  const { showVisualMediaModal } = useVisualMediaModal();
  const { data: session } = useSession();
  const { confirm } = useDialogs();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const isSelectionMode = selectedPhotos.length > 0;

  const { data: visualMedia = initialVisualMedia } = useQuery({
    queryKey: ['profile', profileId, 'photos'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${profileId}/photos`);
      if (!res.ok) throw new Error('Failed to fetch photos');
      return res.json();
    },
    initialData: initialVisualMedia,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  const openVisualMediaModal = (initialSlide: number) => {
    const currentMedia = visualMedia[initialSlide];
    console.log('Opening media:', currentMedia); // Debug log
    
    showVisualMediaModal({ 
      visualMedia: visualMedia.map((media: GetVisualMedia) => ({
        ...media,
        type: media.type,
        autoPlay: false,
        controls: true,
        muted: false,
        loop: true,
      })),
      initialSlide,
      profileId
    });
  };

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoUrl: string) => {
      const res = await fetch(`/api/photos/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrl }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete photo');
      }
      return data;
    },
    onMutate: async (deletedPhotoUrl) => {
      // Cancel outgoing refetches for all affected queries
      await queryClient.cancelQueries({
        queryKey: ['profile', profileId, 'photos'],
        exact: true
      });
      await queryClient.cancelQueries({
        queryKey: ['users', profileId],
        exact: true
      });
      await queryClient.cancelQueries({
        queryKey: ['users', null],
        exact: true
      });

      // Take snapshots of the current data
      const previousPhotos = queryClient.getQueryData(['profile', profileId, 'photos']);
      const previousUserPosts = queryClient.getQueryData(['users', profileId]);
      const previousGlobalPosts = queryClient.getQueryData(['users', null]);

      // Helper function to update posts data
      const updatePosts = (oldData: any) => {
        if (!oldData?.posts) return oldData;

        const updatedPosts = oldData.posts
          .map((post: any) => {
            if (!post?.visualMedia?.length) return post;

            const updatedVisualMedia = post.visualMedia.filter(
              (media: GetVisualMedia) => media.url !== deletedPhotoUrl
            );

            if (updatedVisualMedia.length === post.visualMedia.length) return post;
            if (updatedVisualMedia.length === 0) return null;

            return {
              ...post,
              visualMedia: updatedVisualMedia,
            };
          })
          .filter(Boolean);

        return {
          ...oldData,
          posts: updatedPosts,
        };
      };

      // Update photos optimistically
      queryClient.setQueryData(
        ['profile', profileId, 'photos'],
        (old: GetVisualMedia[] | undefined) => 
          old?.filter(media => media.url !== deletedPhotoUrl) ?? []
      );

      // Update user's posts and mark as fresh
      queryClient.setQueryData(['users', profileId], (oldData: any) => {
        const updatedData = updatePosts(oldData);
        queryClient.invalidateQueries({
          queryKey: ['users', profileId],
          exact: true,
          refetchType: 'none'
        });
        return updatedData;
      });
      
      // Update global posts and mark as fresh
      queryClient.setQueryData(['users', null], (oldData: any) => {
        const updatedData = updatePosts(oldData);
        queryClient.invalidateQueries({
          queryKey: ['users', null],
          exact: true,
          refetchType: 'none'
        });
        return updatedData;
      });

      return { 
        previousPhotos, 
        previousUserPosts,
        previousGlobalPosts 
      };
    },
    onError: (err, _, context) => {
      // Revert all optimistic updates on error
      if (context?.previousPhotos) {
        queryClient.setQueryData(
          ['profile', profileId, 'photos'],
          context.previousPhotos
        );
      }
      if (context?.previousUserPosts) {
        queryClient.setQueryData(
          ['users', profileId],
          context.previousUserPosts
        );
      }
      if (context?.previousGlobalPosts) {
        queryClient.setQueryData(
          ['users', null],
          context.previousGlobalPosts
        );
      }

      showToast({ 
        title: err instanceof Error ? err.message : 'Failed to delete photo', 
        type: 'error' 
      });
    },
    onSuccess: () => {
      // Invalidate and refetch all affected queries
      queryClient.invalidateQueries({
        queryKey: ['profile', profileId, 'photos'],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['users', profileId],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['users', null],
        exact: true
      });
      
      showToast({ title: 'Photo deleted successfully', type: 'success' });
    },
  });

  const handleToggleSelect = (photoUrl: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoUrl) 
        ? prev.filter(url => url !== photoUrl)
        : [...prev, photoUrl]
    );
  };

  const handleDeleteSelected = () => {
    confirm({
      title: 'Delete Photos',
      message: `Are you sure you want to delete ${selectedPhotos.length} selected photos? This will also delete the corresponding posts.`,
      onConfirm: () => {
        Promise.all(selectedPhotos.map(url => deletePhotoMutation.mutate(url)))
          .then(() => setSelectedPhotos([]));
      },
    });
  };

  return (
    <div className="space-y-4">
      {isSelectionMode && session?.user?.id === profileId && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {selectedPhotos.length} selected
          </span>
          <ButtonNaked
            onPress={handleDeleteSelected}
            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-md"
            aria-label="Delete selected photos"
            isDisabled={deletePhotoMutation.isPending}
          >
            <SvgTrash className="h-4 w-4" />
            <span>Delete Selected</span>
          </ButtonNaked>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visualMedia.map((media: GetVisualMedia, i: number) => (
          <div key={media.url} className="relative group bg-card rounded-lg border border-border overflow-hidden">
            {session?.user?.id === profileId && (
              <div className="absolute top-2 right-2 z-20">
                <input
                  type="checkbox"
                  checked={selectedPhotos.includes(media.url)}
                  onChange={() => handleToggleSelect(media.url)}
                  className="h-5 w-5 rounded border-border focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </div>
            )}

            <GalleryItem
              type={media.type}
              url={media.url}
              onClick={() => !isSelectionMode && openVisualMediaModal(i)}
            />

            {media.caption && (
              <div className="p-2 border-t border-border">
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  {media.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
