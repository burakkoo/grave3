import { useState, useCallback, useRef } from 'react';
import Button from '@/components/ui/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import SvgImage from '@/svg_components/Image';
import Check from '@/svg_components/Check';
import { useToast } from '@/hooks/useToast';
import { useQueryClient } from '@tanstack/react-query';

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
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [positionY, setPositionY] = useState(posY);
  const [isDragging, setIsDragging] = useState(false);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  const [showDragMessage, setShowDragMessage] = useState(false);

  const dragStartY = useRef(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to open cover photo
  const openCoverPhoto = useCallback(() => {
    if (photoUrl) {
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
  }, [photoUrl, showVisualMediaModal, profileId]);

  // Handle both mouse and touch events
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPhotoUploaded) return;
    e.preventDefault();
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY - (positionY || 0);
    setShowDragMessage(false);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging && imageRef.current && containerRef.current) {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const containerHeight = containerRef.current.offsetHeight;
      const imageHeight = imageRef.current.offsetHeight;
      
      // Ensure image fills container width and maintains proper height
      if (imageRef.current) {
        imageRef.current.style.width = '100%';
        imageRef.current.style.objectFit = 'cover';
        // Set image height to be 120% of container to allow for movement
        const targetHeight = Math.max(containerHeight * 1.2, imageHeight);
        imageRef.current.style.height = `${targetHeight}px`;
      }

      // Calculate drag bounds
      const maxDragDistance = imageHeight - containerHeight;
      const newY = clientY - dragStartY.current;

      // Constrain the movement
      const constrainedY = Math.max(-maxDragDistance, Math.min(0, newY));
      setPositionY(constrainedY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setTempPhotoUrl(tempUrl);
    
    try {
      const uploadedUrl = await handleChange(e);
      if (uploadedUrl) {
        setTempPhotoUrl(uploadedUrl); // Update temp URL with uploaded URL
        setIsPhotoUploaded(true);
        setShowDragMessage(true);
      }
    } catch (error) {
      setTempPhotoUrl(null);
      setIsPhotoUploaded(false);
    }
  };

  // Save the image's position
  const handleSavePosition = async () => {
    try {
      await savePositionY(positionY!);
      setIsPhotoUploaded(false);
      setShowDragMessage(false);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Cover photo position saved',
      });
      // Force refresh the photo URL to show the new position
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save position',
      });
    }
  };

  return (
    <div
      className="relative h-full w-full mx-auto max-w-2xl overflow-hidden"
      ref={containerRef}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onTouchCancel={handleDragEnd}
    >
      {/* Show loading overlay when uploading */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-center text-white">Cover photo is updating...</p>
        </div>
      )}

      {/* Display either temp preview or actual photo */}
      {(tempPhotoUrl || photoUrl) && (
        <img
          src={tempPhotoUrl || photoUrl || ''}
          alt="Cover"
          className={`absolute w-full object-cover ${
            isPhotoUploaded ? 'cursor-move' : ''
          }`}
          ref={imageRef}
          style={{
            transform: `translateY(${positionY}px)`,
            height: '120%',
            objectPosition: 'center',
            userSelect: 'none',
            pointerEvents: isPhotoUploaded ? 'auto' : 'none',
          }}
          onMouseDown={isPhotoUploaded ? handleDragStart : undefined}
          onTouchStart={isPhotoUploaded ? handleDragStart : undefined}
          draggable="false"
        />
      )}

      {/* Show drag message only after successful upload */}
      {isPhotoUploaded && showDragMessage && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <p className="text-center text-white">Drag to adjust your cover photo</p>
        </div>
      )}

      {/* Photo open button */}
      {!isPhotoUploaded && !isPending && photoUrl && (
        <button
          type="button"
          aria-label="Open cover photo"
          onClick={openCoverPhoto}
          className="absolute inset-0 cursor-pointer bg-black/30 opacity-0 active:opacity-100"
        />
      )}

      {/* Upload/Save buttons */}
      {isOwnProfile && !isPending && (
        <div className="absolute bottom-4 right-4">
          {isPhotoUploaded ? (
            <Button
              Icon={Check}
              iconClassName="text-primary-foreground"
              onPress={handleSavePosition}
              size="small"
              isDisabled={isPending}
            />
          ) : (
            <label>
              <input
                type="file"
                ref={inputFileRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpg, image/jpeg"
                disabled={isPending}
              />
              <Button
                Icon={SvgImage}
                iconClassName="text-primary-foreground"
                onPress={openInput}
                size="small"
                isDisabled={isPending}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
