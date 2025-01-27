import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/getServerUser';
import { isAdminDB } from '../check_admin';

export async function GET(request: Request) {
  // Get the session for the current user
  const [user] = await getServerUser();

  // Ensure the user is authenticated and is an admin
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isadmin = await isAdminDB(user?.id!);

  // return isadmin
  return NextResponse.json({ isadmin }, { status: 200 });
}
