// app/api/check-qr-activation/route.ts

import prisma from '@/lib/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { qrCode, activationCode } = await request.json();

  if (!qrCode || !activationCode) {
    return NextResponse.json({ error: 'QR code and activation code are required' }, { status: 400 });
  }

  // Find the QR code record by code and activation code
  const qrCodeRecord = await prisma.qRCode.findUnique({
    where: { code: qrCode },
  });

  if (!qrCodeRecord) {
    return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
  }

  // Check if the activation code matches
  if (qrCodeRecord.activationCode !== activationCode) {
    console.log(qrCodeRecord.activationCode, activationCode);
    return NextResponse.json({ error: 'Invalid activation code' }, { status: 401 });
  }

  // Check if the QR code has already been used
  if (qrCodeRecord.used) {
    return NextResponse.json({ error: 'QR code has already been used' }, { status: 400 });
  }

  return NextResponse.json({
    message: 'QR code and activation code are valid',
  });
}
