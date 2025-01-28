'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { FallbackProfilePhoto } from '@/components/ui/FallbackProfilePhoto';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { Camera } from '@/svg_components';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

export default function ProfilePhoto({
  isOwnProfile,
  name,
  photoUrl,
  profileId,
}: {
  isOwnProfile: boolean;
  name: string;
  photoUrl: string | null;
  profileId: string;
}) {
  const { inputFileRef, openInput, handleChange, isPending } = useUpdateProfileAndCoverPhotoClient('profile');
  const { showVisualMediaModal } = useVisualMediaModal();
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Handle file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setTempPhotoUrl(tempUrl);

    try {
      const uploadedUrl = await handleChange(e);
      if (uploadedUrl) {
        // Update temp photo URL with the new uploaded URL
        setTempPhotoUrl(uploadedUrl);

        // Update query data for the current user
        queryClient.setQueryData(['user', profileId], (oldData: any) => ({
          ...oldData,
          profilePhoto: uploadedUrl,
        }));

        // Fix: Use proper invalidation syntax
        queryClient.invalidateQueries({
          queryKey: ['user', profileId]
        });
      }
    } catch (error) {
      // Fix: Add required title prop to toast
      showToast({ 
        title: 'Error',
        message: 'Failed to update profile photo.', 
        type: 'error' 
      });
      setTempPhotoUrl(null);
    } finally {
      // Revoke temporary URL
      URL.revokeObjectURL(tempUrl);
    }
  };

  return (
    <div className="absolute bottom-[-88px] h-44 w-44 border-white bg-cover">
      {/* Show loading overlay when uploading */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-full bg-black/50">
          <div className="mb-2 h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-xs text-white">Updating...</p>
        </div>
      )}

      {/* Display either temp preview or actual photo */}
      {(tempPhotoUrl || photoUrl) && (
        <img
          src={tempPhotoUrl || photoUrl || ''}
          alt="Profile photo"
          className="absolute h-full w-full rounded-full border-4 border-white object-cover"
          onError={() => setTempPhotoUrl(null)}
        />
      )}

      {!tempPhotoUrl && !photoUrl && (
        <FallbackProfilePhoto name={name} className="text-6xl" />
      )}

      {/* Photo open button */}
      {!isPending && photoUrl && !tempPhotoUrl && (
        <button
          aria-label="Open profile photo"
          onClick={() =>
            showVisualMediaModal({
              visualMedia: [{ type: 'PHOTO', url: photoUrl, caption: null }],
              initialSlide: 0,
              profileId,
            })
          }
          className="absolute h-full w-full cursor-pointer rounded-full bg-black/30 opacity-0 active:opacity-100"
        />
      )}

      {/* Upload button */}
      {isOwnProfile && !isPending && (
        <label>
          <div className="absolute bottom-0 right-0">
            <input
              type="file"
              ref={inputFileRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
              disabled={isPending}
            />
            <Button
              Icon={Camera}
              iconClassName="text-primary-foreground"
              onPress={openInput}
              size="small"
              isDisabled={isPending}
            />
          </div>
        </label>
      )}
    </div>
  );
}
