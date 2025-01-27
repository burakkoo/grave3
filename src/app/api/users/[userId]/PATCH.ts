import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { Prisma } from '@prisma/client';
import { getServerUser } from '@/lib/getServerUser';
import { userAboutSchema } from '@/lib/validations/userAbout';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { includeToUser } from '@/lib/prisma/includeToUser';

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  try {
    // Validate the authenticated user
    const [user] = await getServerUser();
    if (!user || user.id !== params.userId) {
      return NextResponse.json({ errorMessage: 'Unauthorized access' }, { status: 401 });
    }

    // Parse and validate request body
    const userAbout = await request.json();
    console.log('userAbout:', userAbout);
    const validate = userAboutSchema.safeParse(userAbout);
    if (!validate.success) {
      return NextResponse.json({ errorMessage: validate.error.issues[0].message }, { status: 400 });
    }

    // Update user data in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: validate.data.username,
        name: validate.data.name,
        phoneNumber: validate.data.phoneNumber,
        bio: validate.data.bio,
        website: validate.data.website,
        address: validate.data.address,
        gender: validate.data.gender,
        relationshipStatus: validate.data.relationshipStatus,
        birthDate: validate.data.birthDate ? new Date(validate.data.birthDate) : null,
        dateOfPassing: validate.data.dateOfPassing ? new Date(validate.data.dateOfPassing) : null,
        achievements: validate.data.achievements || [],
        favoriteMusic: validate.data.favoriteMusic || [],
        favoriteMovies: validate.data.favoriteMovies || [],
        photos: validate.data.photos?.filter((photo): photo is string => photo !== null) || [],
        videos: validate.data.videos?.filter((video): video is string => video !== null) || [],
        facebookLink: validate.data.facebookLink,
        instagramLink: validate.data.instagramLink,
        twitterLink: validate.data.twitterLink,
        youtubeLink: validate.data.youtubeLink,
        wikiLink: validate.data.wikiLink,
      },
      include: includeToUser(user.id),
    });

    // Return the updated user information
    return NextResponse.json(toGetUser(updatedUser));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      if (error.code === 'P2002' && error.meta) {
        const field = (error.meta.target as string[])[0];
        return NextResponse.json(
          {
            field,
            message: `This ${field} is already taken.`,
          },
          { status: 409 },
        );
      }
      return NextResponse.json({ errorMessage: 'Database (prisma) error.' }, { status: 502 });
    }

    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return NextResponse.json({ errorMessage: 'Internal Server Error' }, { status: 500 });
  }
}
