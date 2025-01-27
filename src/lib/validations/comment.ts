import { z } from 'zod';

// Reuse the same word break function for consistency
function enforceWordBreaks(value: string) {
  if (!value) return value;
  
  // Split into lines first to preserve intentional line breaks
  return value.split('\n').map(line => {
    // Handle each line separately
    return line.split(' ').map(word => {
      // For very long words (over 30 chars), insert spaces every 30 characters
      if (word.length > 30) {
        return word.match(/.{1,30}/g)?.join(' ') || word;
      }
      return word;
    }).join(' ');
  }).join('\n'); // Preserve original line breaks
}

// Create a content schema that enforces word breaks
const contentSchema = z.string()
  .min(1, 'Comment cannot be empty')
  .transform(enforceWordBreaks);

export const commentWriteSchema = z.object({
  content: contentSchema,
  PostedBy: z.string().optional(),
  Relation: z.string().optional(),
  postId: z.number()
});
