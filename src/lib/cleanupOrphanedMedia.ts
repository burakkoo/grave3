import prisma from '@/lib/prisma/prisma';
import { deleteObject } from '@/lib/s3/deleteObject';

export async function cleanupOrphanedMedia(userId: string) {
  // Find media that isn't connected to any posts
  const orphanedMedia = await prisma.visualMedia.findMany({
    where: {
      userId,
      post: undefined
    }
  });

  // If no orphaned media is found, return early
  if (!orphanedMedia.length) return;

  try {
    // Delete files from S3 and database records in parallel
    await Promise.all(
      orphanedMedia.map(async (media) => {
        try {
          // Delete from S3
          await deleteObject(media.fileName);
          
          // Delete from database
          await prisma.visualMedia.delete({
            where: { id: media.id }
          });
        } catch (error) {
          console.error(`Failed to cleanup media ${media.id}:`, error);
          // Continue with other deletions even if one fails
        }
      })
    );
  } catch (error) {
    console.error('Failed to cleanup orphaned media:', error);
    throw new Error('Failed to cleanup orphaned media');
  }
} 