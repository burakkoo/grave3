import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const [user] = await getServerUser();
    if (!user || user.id !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { positionY } = await request.json();

    await prisma.user.update({
      where: { id: user.id },
      data: { coverPhotoPositionY: positionY },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cover position:', error);
    return NextResponse.json(
      { error: 'Failed to update cover position' },
      { status: 500 }
    );
  }
} 