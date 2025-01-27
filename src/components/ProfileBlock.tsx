import Link from 'next/link';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { cn } from '@/lib/cn';

interface ProfileBlockProps {
  type?: 'post' | 'comment';
  name: string;
  username: string;
  time: string;
  photoUrl: string;
  PostedBy?: string;
  Relation?: string;
  className?: string;
}

export default function ProfileBlock({
  type = 'post',
  username,
  name,
  time,
  photoUrl,
  PostedBy,
  Relation,
  className,
}: ProfileBlockProps) {
  // For posts, only show PostedBy and Relation
  if (type === 'post') {
    return (
      <div className={cn("flex flex-col gap-1 py-1 w-full max-w-2xl mx-auto", className)}>
        {PostedBy && (
          <div className="flex items-baseline gap-2 text-xs text-muted-foreground overflow-hidden">
            <span className="shrink-0">Posted by:</span>
            <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{PostedBy}</span>
          </div>
        )}
        {Relation && (
          <div className="flex items-baseline gap-2 text-xs text-muted-foreground overflow-hidden">
            <span className="shrink-0">Relation:</span>
            <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{Relation}</span>
          </div>
        )}
      </div>
    );
  }

  // For comments, keep the original layout
  return (
    <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0">
          <ProfilePhoto photoUrl={photoUrl} username={username} name={name} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 sm:gap-3">
            <h2 className="cursor-pointer text-lg font-semibold text-muted-foreground">
              <Link href={`/profile/${username}`} className="link">
                {name}
              </Link>
            </h2>
            <h2 className="text-sm text-muted-foreground/90">{time} ago</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
