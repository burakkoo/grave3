import 'server-only';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { v4 as uuid } from 'uuid';
import { uploadObject } from '@/lib/s3/uploadObject';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';
import { getServerUser } from '@/lib/getServerUser';
import { deleteObject } from '@/lib/s3/deleteObject';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'] as const;
type PhotoType = 'profilePhoto' | 'coverPhoto';

interface UpdatePhotoParams {
  request: Request;
  userIdParam: string;
  toUpdate: PhotoType;
}

export async function useUpdateProfileAndCoverPhoto({
  request,
  userIdParam,
  toUpdate,
}: UpdatePhotoParams) {
  try {
    const [user] = await getServerUser();
    if (!user || user.id !== userIdParam) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Get existing photo
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        profilePhoto: toUpdate === 'profilePhoto',
        coverPhoto: toUpdate === 'coverPhoto'
      }
    });

    const oldFileName = toUpdate === 'profilePhoto' 
      ? existingUser?.profilePhoto 
      : existingUser?.coverPhoto;

    // Delete old photo if exists
    if (oldFileName) {
      await Promise.all([
        deleteObject(oldFileName),
        prisma.visualMedia.deleteMany({
          where: {
            userId: user.id,
            fileName: oldFileName,
          }
        })
      ]);
    }

    // Upload new photo
    const fileExtension = file.type.split('/')[1];
    const fileName = `${Date.now()}-${uuid()}.${fileExtension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await uploadObject(buffer, fileName, fileExtension);

    // Simply update the user record for both profile and cover photos
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        [toUpdate === 'profilePhoto' ? 'profilePhoto' : 'coverPhoto']: fileName 
      }
    });

    return NextResponse.json({ 
      uploadedTo: fileNameToUrl(fileName),
      success: true 
    });

  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' }, 
      { status: 500 }
    );
  }
}
