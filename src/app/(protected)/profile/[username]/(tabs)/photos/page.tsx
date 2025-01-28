import { GetVisualMedia } from '@/types/definitions';
import { getProfile } from '../../getProfile';
import { Gallery } from './Gallery';
import prisma from '@/lib/prisma/prisma';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const profile = await getProfile(params.username);
  return {
    title: `Photos | ${profile?.name}` || 'Photos',
  };
}

async function getVisualMedia(username: string) {
  const profile = await getProfile(username);
  
  if (!profile?.id) return [];

  const visualMedia = await prisma.visualMedia.findMany({
    where: {
      userId: profile.id,
      type: {
        in: ['PHOTO', 'VIDEO']  // Include both photos and videos
      },
      post: {
        approvalStatus: true
      }
    },
    include: {
      post: true
    },
    orderBy: {
      id: 'desc',
    },
    distinct: ['fileName'],
  });

  return visualMedia.map(item => ({
    type: item.type,
    url: fileNameToUrl(item.fileName)!,
    caption: item.post.content
  })) as GetVisualMedia[];
}

export default async function PhotosPage({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  const visualMedia = await getVisualMedia(params.username);
  
  if (!profile) return null;

  return <Gallery visualMedia={visualMedia} profileId={profile.id} />;
}
