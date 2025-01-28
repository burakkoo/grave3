import { cn } from '@/lib/cn';
import { Play } from '@/svg_components';
import { VisualMediaType } from '@prisma/client';
import { mergeProps, useFocusRing, usePress } from 'react-aria';

export function GalleryItem({ type, url, onClick }: { type: VisualMediaType; url: string; onClick: () => void }) {
  const { pressProps, isPressed } = usePress({
    onPress: onClick,
  });
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...mergeProps(pressProps, focusProps)}
      role="button"
      tabIndex={0}
      aria-label="Open visual media"
      className={cn(
        'group relative aspect-square overflow-hidden rounded-lg focus:outline-none',
        isFocusVisible && 'border-4 border-yellow-500'
      )}>
      {type === 'PHOTO' ? (
        <img 
          src={url} 
          className={cn(
            'h-full w-full object-cover transition-transform duration-200 group-hover:scale-105', 
            isPressed && 'brightness-75'
          )} 
          alt="Gallery photo" 
        />
      ) : (
        <>
          <Play
            width={36}
            height={36}
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-10 stroke-white drop-shadow-lg transition-transform group-hover:scale-125"
          />
          <video 
            className="h-full w-full object-cover"
            preload="metadata"
            playsInline
            muted
          >
            <source src={url} type="video/mp4" />
          </video>
        </>
      )}
    </div>
  );
}
