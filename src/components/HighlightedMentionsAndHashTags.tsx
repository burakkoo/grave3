import Link from 'next/link';

export function HighlightedMentionsAndHashTags({
  content,
  shouldAddLinks = false
}: {
  content: string | null | undefined;
  shouldAddLinks?: boolean;
}) {
  if (!content) return null;

  return (
    <p className="break-words whitespace-pre-wrap">
      {content.split(/(@\w+|#\w+)/).map((part, i) => {
        if (part.startsWith('@')) {
          return (
            <Link
              key={i}
              href={`/profile/${part.slice(1)}`}
              className="inline-block text-primary hover:underline">
              {part}
            </Link>
          );
        }
        if (part.startsWith('#')) {
          return (
            <Link
              key={i}
              href={`/posts/hashtag/${part.slice(1)}`}
              className="inline-block text-primary hover:underline">
              {part}
            </Link>
          );
        }
        return part;
      })}
    </p>
  );
}
