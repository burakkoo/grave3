import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import isAdmin from '../check_admin';

export async function DELETE(request: Request) {
  const res = isAdmin();

  if (!res) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    return NextResponse.json({ error: 'User not found or cannot be deleted' }, { status: 404 });
  }
}
