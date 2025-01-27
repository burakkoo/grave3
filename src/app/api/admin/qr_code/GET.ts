import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import isAdmin from '../check_admin';

export async function GET(request: Request) {
  const res = isAdmin();

  if (!res) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const qrCodes = await prisma.qRCode.findMany({
    orderBy: {
      used: 'desc', // or 'desc' depending on the desired order
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json(qrCodes);
}
