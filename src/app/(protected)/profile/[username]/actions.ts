'use server'

import { revalidatePath } from 'next/cache'
import { UserAboutSchema } from '@/lib/validations/userAbout'

export async function updateProfile(data: UserAboutSchema) {
  // ... your existing update logic

  // Revalidate the profile page after update
  revalidatePath('/profile/[username]')
  revalidatePath('/profile/[username]/about')
} 