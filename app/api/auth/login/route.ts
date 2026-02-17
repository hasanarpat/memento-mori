import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { z } from 'zod';

export const dynamic = 'force-dynamic'

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  // 1. Artificial Delay - Anti Brute Force
  // Delays response by random 500-1000ms to slow down attackers significantly
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  const payload = await getPayload({ config: configPromise })
  
  try {
    const body = await request.json()
    
    // 2. Strict Validation
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    // 3. Secure Login via Payload
    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
      req: request as unknown as Request,
    })

    if (!result.token) {
       return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 4. Secure Response
    // Return token and minimal user info.
    // Ideally set cookie here, but for now returning token is fine for API usage.
    const user = result.user;
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        id: user.id,
      },
      token: result.token,
      exp: result.exp,
      message: 'Login successful'
    })

  } catch (error) {
    // 5. Error Masking
    // Always return generic error for login failures to prevent user enumeration
    console.error('Login attempt failed:', error)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
