import { date, z } from 'zod';
import { sub } from 'date-fns';

// Helper for non-empty strings
const nonEmptyString = z.string().trim().min(3, { message: 'Value must be at least three characters' });

// Helper for URL validation
const urlString = z
  .string()
  .url({ message: 'Invalid URL format' })
  .or(z.literal('')) // Allow empty strings for optional URLs
  .nullable();

// Main schema
export const userAboutSchema = z.object({
  username: nonEmptyString.regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Only alphanumeric characters and underscores are allowed',
  }),
  name: nonEmptyString,
  phoneNumber: z
    .string()
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number' })
    .nullable(),
  bio: nonEmptyString.nullable(),
  website: urlString,
  address: nonEmptyString.nullable(),
  gender: z.union([z.literal('FEMALE'), z.literal('MALE'), z.literal('NONBINARY')]).nullable(),
  relationshipStatus: z
    .union([z.literal('SINGLE'), z.literal('IN_A_RELATIONSHIP'), z.literal('ENGAGED'), z.literal('MARRIED')])
    .nullable(),
  birthDate: z
    .string()
    .nullable()
    .superRefine((value, ctx) => {
      if (value) {
        const today = new Date();
        const selectedDate = new Date(value);

        const min = sub(today, { years: 85 });
        const max = sub(today, { years: 18 });

        if (selectedDate > max) {
          ctx.addIssue({
            message: 'You must be at least 18 years old',
            code: z.ZodIssueCode.invalid_date,
          });
        }

        if (selectedDate < min) {
          ctx.addIssue({
            message: 'You must be younger than 85 years old',
            code: z.ZodIssueCode.invalid_date,
          });
        }
      }
    }),

  dateOfPassing: z
    .string()
    .nullable()
    .superRefine((value, ctx) => {
      if (value) {
        const today = new Date();
        const selectedDate = new Date(value);

        if (selectedDate > today) {
          ctx.addIssue({
            message: 'Date of passing cannot be in the future',
            code: z.ZodIssueCode.invalid_date,
          });
        }
      }
    }),

  // New Fields

  achievements: z
    .array(z.string().min(1, { message: 'Achievement cannot be empty' }))
    .nullable()
    .default([]), // Optional, default to an empty array

  favoriteMusic: z
    .array(z.string().min(1, { message: 'Favorite music item cannot be empty' }))
    .nullable()
    .default([]), // Optional, default to an empty array

  favoriteMovies: z
    .array(z.string().min(1, { message: 'Favorite movie item cannot be empty' }))
    .nullable()
    .default([]), // Optional, default to an empty array

  photos: z.array(urlString).nullable().default([]), // Array of photo URLs, optional, default to an empty array

  videos: z.array(urlString).nullable().default([]), // Array of video URLs, optional, default to an empty array

  youtubeLink: nonEmptyString.nullable(),

  facebookLink: nonEmptyString.nullable(),

  instagramLink: nonEmptyString.nullable(),

  twitterLink: nonEmptyString.nullable(),

  wikiLink: nonEmptyString.nullable(),
});

export type UserAboutSchema = z.infer<typeof userAboutSchema>;
