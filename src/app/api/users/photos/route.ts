import { auth } from '@/auth';
import { db } from '@/db';
import { uploadPhoto } from '@/lib/uploadPhoto';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const skipPost = formData.get('skipPost') as string;

    if (!file) {
      return new Response('No file provided', { status: 400 });
    }

    // Upload photo to storage
    const photoUrl = await uploadPhoto(file);

    // Update user's photo URL based on type
    if (type === 'profile') {
      await db.user.update({
        where: { id: session.user.id },
        data: { photoUrl }
      });
    } else if (type === 'cover') {
      await db.user.update({
        where: { id: session.user.id },
        data: { coverPhotoUrl: photoUrl }
      });
    }

    // Skip creating a post if skipPost is true
    if (skipPost !== 'true') {
      await db.post.create({
        data: {
          userId: session.user.id,
          photos: [photoUrl],
          type: type === 'profile' ? 'PROFILE_PHOTO' : 'COVER_PHOTO',
        },
      });
    }

    // Revalidate relevant paths
    revalidatePath(`/profile/${session.user.username}`);
    revalidatePath(`/profile/${session.user.username}/about`);

    return Response.json({ success: true, photoUrl });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return new Response('Error uploading photo', { status: 500 });
  }
} 