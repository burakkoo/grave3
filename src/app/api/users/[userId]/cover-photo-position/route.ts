import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';

export async function PATCH(request: Request) {
  const [user] = await getServerUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const userId = url.pathname.split('/')[3]; // Extract userId from the URL path
  const { positionY } = await request.json();

  if (user.id !== userId) {
    return NextResponse.json({ message: 'Forbidden: You can only update your own profile.' }, { status: 403 });
  }

  if (typeof positionY !== 'number' || isNaN(positionY)) {
    return NextResponse.json({ message: 'Invalid positionY value.' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        coverPhotoPositionY: positionY,
      },
    });

    return NextResponse.json({
      message: 'Cover photo position updated successfully.',
      coverPhotoPositionY: updatedUser.coverPhotoPositionY,
    });
  } catch (error) {
    console.error('Error updating cover photo position:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
