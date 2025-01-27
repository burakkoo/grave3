import { Blob } from 'buffer';
import { z } from 'zod';

const urlSchema = z.string().url();

// Improved word break function that handles both content and comments
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

// Create a reusable string schema with word break enforcement
const contentSchema = z.string()
  .refine((value) => value.trim() !== '', {
    message: 'Content should not contain only spaces.',
  })
  .transform(enforceWordBreaks);

export const postWriteSchema = z
  .object({
    content: z.optional(contentSchema),
    files: z
      .union([
        z.instanceof(Blob),
        urlSchema,
        z.array(z.instanceof(Blob)),
        z.array(urlSchema),
        z.array(z.union([z.instanceof(Blob), urlSchema])),
      ])
      .optional(),
    profileId: z.string(),
    name: z.optional(z.string()),
    relation: z.optional(z.string()),
    comment: z.optional(contentSchema),
  })
  .refine((data) => data.content !== undefined || data.files !== undefined, {
    message: "Either 'content' or 'files' must be defined.",
  });
