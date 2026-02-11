import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // Only require email verification in production
    verify:
      process.env.NODE_ENV === 'production'
        ? {
            generateEmailHTML: ({ token, user }) => {
              return `
          <!DOCTYPE html>
          <html>
          <body style="font-family: serif; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 40px; border: 1px solid #ddd;">
              <h1 style="text-align: center; font-family: 'Cinzel', serif; letter-spacing: 2px;">MEMENTO MORI</h1>
              <p>Greetings ${user.name},</p>
              <p>To access the inner circle and complete your rituals, you must verify your existence.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">Verify Email</a>
              </div>
              <p style="font-size: 12px; color: #888; text-align: center;">Or copy this link: ${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}</p>
            </div>
          </body>
          </html>
        `;
            },
          }
        : undefined,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'surname',
      type: 'text',
      label: 'Surname',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'age',
      type: 'number',
      label: 'Age',
      min: 18,
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'unsure' },
      ],
    },
    {
      name: 'wishlist',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'cart',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          defaultValue: 1,
          required: true,
        },
      ],
    },
  ],
};
