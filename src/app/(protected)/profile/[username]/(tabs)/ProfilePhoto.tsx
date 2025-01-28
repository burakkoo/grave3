'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import { FallbackProfilePhoto } from '@/components/ui/FallbackProfilePhoto';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { Camera } from '@/svg_components';
import Check from '@/svg_components/Check';
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
        // Update temp URL with the uploaded URL
        setTempPhotoUrl(uploadedUrl);
        
        // Invalidate and refetch queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['user'] }),
          queryClient.refetchQueries({ queryKey: ['user'] })
        ]);

        // Wait a bit longer before clearing the temp URL
        setTimeout(() => {
          setTempPhotoUrl(null);
        }, 1000); // Increased timeout to ensure new photo is loaded
      }
    } catch (error) {
      setTempPhotoUrl(null);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile photo',
      });
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
          onLoad={() => {
            if (!tempPhotoUrl) return; // Only handle load for temp URL
            
            // Ensure the new image is loaded before clearing temp URL
            const img = new Image();
            img.src = photoUrl || '';
            img.onload = () => {
              setTimeout(() => setTempPhotoUrl(null), 100);
            };
          }}
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
