// app/api/find-qr-user/route.ts

import prisma from '@/lib/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qrCode = searchParams.get('qrCode');

  if (!qrCode) {
    return NextResponse.json({ error: 'No QR code provided' }, { status: 400 });
  }

  const qrCodeRecord = await prisma.qRCode.findUnique({
    where: { code: qrCode },
  });

  if (qrCodeRecord) {
    const existingUser = await prisma.user.findFirst({
      where: {
        qrCode: {
          code: qrCode,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json({ redirectUrl: `/profile/${existingUser.username}`, used: true });
    } else {
      return NextResponse.json({ redirectUrl: `/register?qrCode=${qrCode}`, used: false });
    }
  }

  return NextResponse.json({ error: 'QR code not found or unused' }, { status: 404 });
}
