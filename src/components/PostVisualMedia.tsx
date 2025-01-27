import { cn } from '@/lib/cn';
import { Play } from '@/svg_components';
import { VisualMediaType } from '@prisma/client';
import { mergeProps, useFocusRing, usePress } from 'react-aria';

interface PostVisualMediaProps {
  type: VisualMediaType;
  url: string;
  onClick: () => void;
  height: string;
  colSpan: number;
  isSingleImage?: boolean;
}

export function PostVisualMedia({
  type,
  url,
  onClick,
  height,
  colSpan,
  isSingleImage = false,
}: PostVisualMediaProps) {
  const { pressProps, isPressed } = usePress({
    onPress: onClick,
  });
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...mergeProps(pressProps, focusProps)}
      role="button"
      tabIndex={0}
      className={cn(
        'relative cursor-pointer focus:outline-none group',
        // Only use aspect-square for grid images
        !isSingleImage && 'aspect-square',
        colSpan === 1 ? 'col-span-1' : 'col-span-2',
        isFocusVisible && 'border-4 border-yellow-500',
      )}>
      {type === 'PHOTO' ? (
        <img 
          src={url} 
          alt="Post photo" 
          className={cn(
            'w-full',
            // Use contain for single images, cover for grid
            isSingleImage ? 'object-contain max-h-[32rem]' : 'h-full object-cover',
            isPressed && 'brightness-75'
          )} 
        />
      ) : (
        <>
          <Play
            width={36}
            height={36}
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] stroke-yellow-100 transition-transform group-hover:scale-125"
          />
          <video className={cn(
            'w-full',
            isSingleImage ? 'max-h-[32rem] object-contain' : 'h-full object-cover'
          )}>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
}
