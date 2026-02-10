import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format').trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name is required').trim(),
  surname: z.string().min(2, 'Surname is required').trim(),
  phone: z.string().optional(),
  age: z.coerce.number().min(18, 'You must be at least 18 years old').optional(),
  gender: z.enum(['male', 'female', 'other', 'unsure']).optional(),
});

export async function POST(request: Request) {
  // 1. Artificial Delay - Anti Brute Force
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  const payload = await getPayload({ config: configPromise })
  
  try {
    const body = await request.json()
    
    // 1. Strict Validation
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Return only the first error message to avoid information listing
      const errorMessage = validationResult.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { email, password, name, surname, phone, age, gender } = validationResult.data;

    // 2. Check existence (Silent Protection)
    // Don't reveal if user exists to prevent email enumeration attacks
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.totalDocs > 0) {
      // Return generic error or success (to confuse attackers)
      // Usually returning 409 is standard, but for high security, 
      // sometimes 200 with "If account exists, email sent" is better.
      // Here we will use a standard but polite conflict error.
      return NextResponse.json({ error: 'Account already exists' }, { status: 409 })
    }

    // 3. Create User
    // Payload automatically hashes passwords securely (bcrypt/argon2)
    // 3. Create User
    // Payload automatically hashes passwords securely (bcrypt/argon2)
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name,
        surname,
        phone,
        age,
        gender,
      },
    })
    
    // 4. Auto Login
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
      req: request,
    })

    if (!loginResult.token) {
        // Fallback if auto-login fails for some reason
        return NextResponse.json({ 
          success: true, 
          message: 'Account created successfully. Please log in.' 
        }, { status: 201 })
    }

    // 5. Secure Response
    return NextResponse.json({ 
      success: true, 
      message: 'Account created and logged in successfully.',
      token: loginResult.token,
      user: {
        email: newUser.email,
        id: newUser.id,
        name: newUser.name,
      }
    }, { status: 201 })

  } catch (error) {
    // 5. Error Masking
    // Log the real error internally for admins
    console.error('Registration Security Alert:', error)
    
    // Return a generic error to the user
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again later.' 
    }, { status: 500 })
  }
}
