import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import isAdmin from '../../check_admin';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const res = isAdmin();

  if (!res) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json({ error: 'User ID and new password are required' }, { status: 400 });
    }

    // // Validate password
    // const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$/;
    // if (!strongPasswordRegex.test(password)) {
    //   return NextResponse.json({ error: 'Password does not meet the required strength criteria' }, { status: 400 });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: `Password for user ${updatedUser.name} has been reset successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while resetting the password' }, { status: 500 });
  }
}
