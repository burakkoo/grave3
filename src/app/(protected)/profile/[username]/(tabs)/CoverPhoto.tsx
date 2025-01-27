import { useState, useCallback, useRef } from 'react';
import Button from '@/components/ui/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import SvgImage from '@/svg_components/Image';
import Check from '@/svg_components/Check';

interface CoverPhotoProps {
  isOwnProfile: boolean;
  photoUrl: string | null;
  posY: number | null;
  profileId: string;
}

export default function CoverPhoto({
  isOwnProfile,
  photoUrl,
  posY,
  profileId,
}: CoverPhotoProps) {
  const { inputFileRef, openInput, handleChange, savePositionY, isPending } =
    useUpdateProfileAndCoverPhotoClient('cover');
  const { showVisualMediaModal } = useVisualMediaModal();

  // Simplified state
  const [position, setPosition] = useState<number>(posY || 0);
  const [isEditing, setIsEditing] = useState(false);

  const openCoverPhoto = useCallback(() => {
    if (photoUrl && !isEditing) {
      showVisualMediaModal({
        visualMedia: [
          {
            type: 'PHOTO',
            url: photoUrl,
            caption: null,
          },
        ],
        initialSlide: 0,
        profileId: profileId
      });
    }
  }, [photoUrl, showVisualMediaModal, profileId, isEditing]);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleChange(e);
    setIsEditing(true);
  };

  // Save position and exit edit mode
  const handleSave = () => {
    savePositionY(position);
    setIsEditing(false);
  };

  // Simple position adjustment buttons
  const adjustPosition = (direction: 'up' | 'down') => {
    setPosition(prev => {
      const newPosition = direction === 'up' ? prev + 10 : prev - 10;
      // Limit the range of movement
      return Math.max(Math.min(newPosition, 0), -200);
    });
  };

  return (
    <div className="relative h-full w-full mx-auto">
      {photoUrl && (
        <div className="relative h-full w-full">
          <img
            src={photoUrl}
            alt="Cover"
            className="absolute h-full w-full object-cover"
            style={{ 
              transform: `translateY(${position}px)`,
              objectPosition: `center ${position}px`
            }}
            draggable="false"
          />
          
          {/* Overlay for opening photo modal */}
          {!isEditing && (
            <button
              type="button"
              aria-label="Open cover photo"
              onClick={openCoverPhoto}
              className="absolute h-full w-full cursor-pointer bg-black/30 opacity-0 active:opacity-100"
            />
          )}

          {/* Edit controls */}
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-background/80 backdrop-blur-sm">
                <div className="flex gap-2">
                  <Button
                    onPress={() => adjustPosition('up')}
                    size="small"
                  >
                    Move Up
                  </Button>
                  <Button
                    onPress={() => adjustPosition('down')}
                    size="small"
                  >
                    Move Down
                  </Button>
                </div>
                <Button
                  onPress={handleSave}
                  Icon={Check}
                  size="small"
                >
                  Save Position
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      {isOwnProfile && !isEditing && !isPending && (
        <label>
          <div className="absolute bottom-4 right-4">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button
              Icon={SvgImage}
              iconClassName="text-primary-foreground"
              onPress={openInput}
              size="small"
              loading={isPending}
            />
          </div>
        </label>
      )}
    </div>
  );
}
