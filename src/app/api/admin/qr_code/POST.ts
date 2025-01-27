/**
 * POST /api/admin/qrcodes
 * - Allows an authenticated admin user to generate a QR code
 * with an activation key.
 */
import { v4 as uuidv4 } from 'uuid'; // Use UUID for random QR codes
import crypto from 'crypto'; // To generate random activation codes
import { z } from 'zod';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma'; // Assuming this is your Prisma client setup
import { getServerUser } from '@/lib/getServerUser';
import isAdmin from '../check_admin';

// Define the schema for validating the incoming request body
const qrCodeSchema = z.object({
  code: z.string().min(1, 'QR code is required'),
  activationKey: z.string().min(1, 'Activation key is required'),
});

// get isadmin from user table

export async function POST(request: Request) {
  const res = isAdmin();

  // if (res) {
  //   return res;
  // }
  const body = await request.json();

  try {
    const qrCodes = Array.from({ length: body.count }).map(() => ({
      code: uuidv4(), // Generate a unique QR code
      activationCode: crypto.randomBytes(5).toString('hex'), // Generate a unique activation code
    }));

    // Insert QR codes into the database
    await prisma.qRCode.createMany({
      data: qrCodes,
    });

    // Return the created QR code as the response
    return NextResponse.json(qrCodes, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues.map((issue) => issue.message).join(', '),
        },
        { status: 422 },
      );
    }

    // Handle any other errors
    console.error('Error creating QR codes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
