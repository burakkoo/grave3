import prisma from '@/lib/prisma/prisma'; // Assuming this is your Prisma client setup
import { getServerUser } from '@/lib/getServerUser';
import { NextResponse } from 'next/server';

// get isadmin from user table

export const isAdminDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isadmin: true },
  });
  return user?.isadmin;
};

const isAdmin = async () => {
  // Get the session for the current user
  const [user] = await getServerUser();

  // Ensure the user is authenticated and is an admin
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isadmin = await isAdminDB(user?.id!);
  console.log(isadmin);
  // Ensure the user is authenticated and is an admin
  if (!isadmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
};

export default isAdmin;
