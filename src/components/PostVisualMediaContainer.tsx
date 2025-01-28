'use client';

import { cn } from '@/lib/cn';
import { isOdd } from '@/lib/isOdd';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { GetVisualMedia } from '@/types/definitions';
import { useState } from 'react';

interface PostVisualMediaContainerProps {
  visualMedia: GetVisualMedia[];
  profileId: string;
  userId: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export function PostVisualMediaContainer({
  visualMedia,
  profileId,
  userId,
  autoPlay = false,
  muted = true,
  controls = false,
}: PostVisualMediaContainerProps) {
  const { showVisualMediaModal } = useVisualMediaModal();
  const len = visualMedia.length;
  const [isError, setIsError] = useState(false);

  const isOwnProfile = userId === profileId;

  const renderMediaItem = (item: GetVisualMedia, index: number) => {
    const isVideo = item.type === 'VIDEO';
    const className = cn(
      'w-full h-full object-cover cursor-pointer',
      len > 1 ? 'aspect-square' : 'max-h-[32rem]',
      'rounded-lg'
    );

    const handleClick = () => {
      showVisualMediaModal({ 
        visualMedia, 
        initialSlide: index,
        profileId
      });
    };

    if (isVideo) {
      return (
        <div className="relative group" onClick={handleClick}>
          <video
            className={className}
            autoPlay={autoPlay}
            muted={muted}
            controls={controls}
            loop
            playsInline
            onError={() => setIsError(true)}
          >
            <source src={item.url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-2 rounded-full bg-black/50">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    return (
      <img 
        src={item.url} 
        alt={item.caption || 'Post media'}
        className={className}
        onClick={handleClick}
        onError={() => setIsError(true)}
      />
    );
  };

  if (isError) {
    return (
      <div className="w-full h-48 flex items-center justify-center rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">Media unavailable</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-1',
      len === 1 && 'grid-cols-1',
      len === 2 && 'grid-cols-2',
      len > 2 && 'grid-cols-2 grid-rows-2',
    )}>
      {visualMedia.map((item, index) => (
        <div key={item.url} className={cn(
          'relative overflow-hidden rounded-lg',
          len === 1 ? 'col-span-1' : '',
          len > 2 && index === 0 ? 'col-span-2 row-span-1' : ''
        )}>
          {renderMediaItem(item, index)}
        </div>
      ))}
    </div>
  );
}
