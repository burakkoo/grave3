import { cn } from '@/lib/cn';
import { isOdd } from '@/lib/isOdd';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { GetVisualMedia } from '@/types/definitions';
import { PostVisualMedia } from './PostVisualMedia';

export function PostVisualMediaContainer({ 
  visualMedia, 
  profileId,
  userId 
}: { 
  visualMedia: GetVisualMedia[]; 
  profileId: string;
  userId: string;
}) {
  const { showVisualMediaModal } = useVisualMediaModal();
  const len = visualMedia.length;

  const isOwnProfile = userId === profileId;

  return (
    <div className={cn(
      'relative grid w-full',
      len > 2 ? 'grid-cols-2' : 'grid-cols-1',
      'gap-1 rounded-lg overflow-hidden'
    )}>
      {visualMedia.length > 0 &&
        visualMedia.map((item, i) => {
          if (i > 3) return false;
          return (
            <PostVisualMedia
              key={i}
              type={item.type}
              url={item.url}
              // Only use aspect-square for grid layouts with multiple images
              height={len > 1 ? 'aspect-square' : 'max-h-[32rem] h-auto'}
              // If single image or first image in odd-numbered set < 4, take full width
              colSpan={isOdd(len) && len < 4 && i === 0 ? 2 : 1}
              onClick={() => showVisualMediaModal({ 
                visualMedia, 
                initialSlide: i,
                profileId,
                isOwnProfile
              })}
              // Pass whether this is a single image
              isSingleImage={len === 1}
            />
          );
        })}
      {len > 4 && (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-black/50 rounded-full p-2">
          <p className="text-3xl font-semibold text-white">
            +{len - 4}
          </p>
        </div>
      )}
    </div>
  );
}
