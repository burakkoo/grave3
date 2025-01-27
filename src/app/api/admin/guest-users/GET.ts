import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import isAdmin from '../check_admin';

export async function GET(request: Request) {
  const res = isAdmin();

  if (!res) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const uniqueCombos = await prisma.post.findMany({
    distinct: ['PostedBy', 'Relation'],
    where: {
      PostedBy: {
        not: null,
      },
      Relation: {
        not: null,
      },
    },
    select: {
      PostedBy: true,
      Relation: true,
    },
  });

  return NextResponse.json(uniqueCombos);
}
