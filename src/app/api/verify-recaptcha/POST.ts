/**
 * POST /api/verify-recaptcha
 * - Verifies a reCAPTCHA token using Google's reCAPTCHA API.
 */
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Define the schema for validating the incoming request body
const recaptchaSchema = z.object({
  token: z.string().min(1, 'reCAPTCHA token is required'),
});

const turnstileSchema = z.object({
  token: z.string().min(1, 'Turnstile token is required'),
});

// POST request handler
export async function POST(request: Request) {
  // try {
  //   // Parse and validate the request body
  //   const body = await request.json();
  //   const validation = recaptchaSchema.safeParse(body);
  //   if (!validation.success) {
  //     return NextResponse.json(
  //       { error: validation.error.issues.map((issue) => issue.message).join(', ') },
  //       { status: 422 },
  //     );
  //   }

  //   const { token } = body;
  //   const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  //   // Make a request to Google's reCAPTCHA API to verify the token
  //   const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: `secret=${secretKey}&response=${token}`,
  //   });
  //   const data = await response.json();

  //   // Check if the verification was successful
  //   if (data.success) {
  //     return NextResponse.json({ success: true }, { status: 200 });
  //   } else {
  //     return NextResponse.json({ success: false, error: 'Invalid reCAPTCHA token' }, { status: 400 });
  //   }
  // } catch (error) {
  //   // Handle unexpected errors
  //   console.error('Error verifying reCAPTCHA:', error);
  //   return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  // }

  try {
    // Parse and validate the request body
    const body = await request.json();
    const validation = turnstileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues.map((issue) => issue.message).join(', ') },
        { status: 422 },
      );
    }

    const { token } = body;
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    // Make a request to Cloudflare's Turnstile API to verify the token
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    // Check if the verification was successful
    if (data.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, errors: data['error-codes'] || 'Verification failed' },
        { status: 400 },
      );
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error verifying Turnstile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
