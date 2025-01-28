'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import { FallbackProfilePhoto } from '@/components/ui/FallbackProfilePhoto';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { Camera } from '@/svg_components';
import Check from '@/svg_components/Check';

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
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setIsPhotoUploaded(true);
  };

  // Handle save
  const handleSave = () => {
    setIsPhotoUploaded(false);
  };

  return (
    <div className="absolute bottom-[-88px] h-44 w-44 border-white bg-cover">
      {photoUrl && (
        <img src={photoUrl} alt="Profile photo" className="absolute h-full w-full rounded-full border-4 object-cover" />
      )}
      {photoUrl && !isPhotoUploaded ? (
        <button
          aria-label="Open profile photo"
          onClick={() =>
            showVisualMediaModal({
              visualMedia: [
                {
                  type: 'PHOTO',
                  url: photoUrl as string,
                  caption: null,
                },
              ],
              initialSlide: 0,
              profileId,
            })
          }
          className="absolute h-full w-full cursor-pointer rounded-full bg-black/30 opacity-0 active:opacity-100"
        />
      ) : !photoUrl && (
        <FallbackProfilePhoto name={name} className="text-6xl" />
      )}
      {isOwnProfile && (isPhotoUploaded || !isPending) && (
        <label>
          <div className="absolute bottom-0 right-0">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button 
              Icon={isPhotoUploaded ? Check : Camera} 
              onPress={isPhotoUploaded ? handleSave : openInput} 
              size="small" 
              loading={isPending} 
            />
          </div>
        </label>
      )}
    </div>
  );
}
