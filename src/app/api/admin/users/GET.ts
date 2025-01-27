import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import isAdmin from '../check_admin';

export async function GET(request: Request) {
  const res = isAdmin();

  if (!res) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: {
      qrCode: true,
    },
  });

  return NextResponse.json(users);
}
