import { NextRequest, NextResponse } from 'next/server';
import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';
import { getServerUser } from '@/lib/getServerUser';

export async function POST(request: NextRequest) {
  const [user] = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const toUpdate = formData.get('toUpdate') as 'profilePhoto' | 'coverPhoto';

  return useUpdateProfileAndCoverPhoto({
    request,
    userIdParam: user.id,
    toUpdate,
  });
} 