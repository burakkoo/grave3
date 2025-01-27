/// this is the create post part in the post's feed thats ath the top of the feed

'use client';

import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import SvgImage from '@/svg_components/Image';
import { useCallback } from 'react';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { ButtonNaked } from './ui/ButtonNaked';

export function CreatePostModalLauncher({ profileId, userId }: { profileId: string; userId: string }) {
  const { launchCreatePost } = useCreatePostModal();

  const handleLaunchCreatePost = useCallback(
    () =>
      launchCreatePost({
        shouldOpenFileInputOnMount: false,
        profileId,
        userId,
      }),
    [launchCreatePost, profileId, userId],
  );

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card px-4 py-4 shadow sm:px-8 sm:py-5 mx-auto w-full max-w-2xl">
      <div className="mb-[18px] flex flex-row">
        {userId && (
          <div className="mr-3 h-12 w-12">
            <ProfilePhotoOwn />
          </div>
        )}
        <ButtonNaked onPress={handleLaunchCreatePost} className="flex h-11 flex-grow flex-col justify-center">
          <p className="text-muted-foreground/70">Enter a note...</p>
        </ButtonNaked>
      </div>
      <div className="flex flex-row gap-4">
        <ButtonNaked
          onPress={handleLaunchCreatePost}
          className="group flex cursor-pointer flex-row items-center gap-4">
          <SvgImage className="h-6 w-6 text-muted-foreground" />
          <p className="text-base font-semibold text-muted-foreground group-hover:text-muted-foreground/80">
            Add Image / Video
          </p>
        </ButtonNaked>
      </div>
    </div>
  );
}
