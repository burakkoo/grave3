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

  // State to track position, dragging status, and image upload status
  const [positionY, setPositionY] = useState(posY);
  const [isDragging, setIsDragging] = useState(false);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [showDragMessage, setShowDragMessage] = useState(true); // State for showing the message

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

  // Handle image dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPhotoUploaded) return; // Prevent dragging if no photo uploaded
    setIsDragging(true);
    dragStartY.current = e.clientY - positionY!; // Capture initial Y position when dragging starts
    setShowDragMessage(false); // Hide the message on first interaction
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageRef.current && containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const imageHeight = imageRef.current.offsetHeight;
      const newY = e.clientY - dragStartY.current;

      // Ensure that the image stays within container bounds
      if (newY <= 0 && newY >= containerHeight - imageHeight) {
        setPositionY(newY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false); // Stop dragging when mouse is released
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e); // Call original handleChange to update the photo
    setIsPhotoUploaded(true); // Enable dragging after photo is uploaded
    setShowDragMessage(true); // Show the message after a new photo is uploaded
  };

  // Save the image's position
  const handleSavePosition = () => {
    setIsPhotoUploaded(false); // Reset photo upload state
    savePositionY(positionY!); // Call the savePositionY function
    console.log('Position saved:', positionY); // Implement save logic here
  };

  // Use effect or logic to hide the message after any interaction
  const disableDragMessage = () => {
    setShowDragMessage(false);
  };

  return (
    <div
      className="relative h-full w-full mx-auto max-w-2xl"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Ensure dragging stops when the cursor leaves the container
    >
      {photoUrl && (
        <img
          src={photoUrl}
          alt="Cover"
          className={`absolute w-full object-cover ${isPhotoUploaded ? 'cursor-move' : ''}`} // Show grab cursor
          ref={imageRef}
          style={{ transform: `translateY(${positionY}px)` }}
          onMouseDown={handleMouseDown}
          draggable="false" // Disable default image drag behavior
        />
      )}

      {/* Show a message that the user can drag the image */}
      {isPhotoUploaded && showDragMessage && (
        <div
          onMouseDown={disableDragMessage}
          className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/50 text-white">
          <p className="text-center">Drag to adjust your cover photo</p>
        </div>
      )}

      {/* Overlay to open photo modal */}
      {!isPhotoUploaded && (
        <button
          type="button"
          aria-label="Open cover photo"
          onClick={openCoverPhoto}
          className="absolute h-full w-full cursor-pointer bg-black/30 opacity-0 active:opacity-100"
        />
      )}

      {/* File upload for own profile */}
      {isOwnProfile && (isPhotoUploaded || !isPending) && (
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

      {/* Show Save button only after a new photo is uploaded */}
      {isPhotoUploaded && !isPending && (
        <label>
          <div className="absolute bottom-4 right-4">
            <Button Icon={Check} iconClassName="text-primary-foreground" onPress={handleSavePosition} size="small" />
          </div>
        </label>
      )}
    </div>
  );
}
