import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = contactSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: 'Validation error', errors: result.error.issues },
                { status: 400 }
            );
        }

        const { name, email, subject, message } = result.data;

        const payload = await getPayload({ config: configPromise });

        await payload.create({
            collection: 'messages',
            data: {
                name,
                email,
                subject,
                message,
                status: 'new',
            },
        });

        return NextResponse.json(
            { message: 'Message sent successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

