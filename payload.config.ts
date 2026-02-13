import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { resendAdapter } from '@payloadcms/email-resend';
import { buildConfig } from 'payload';
import path from 'path';
import sharp from 'sharp';

import { Users } from './cms/Users.ts';
import { Media } from './cms/Media.ts';
import { Products } from './cms/Products.ts';
import { Categories } from './cms/Categories.ts';
import { Orders } from './cms/Orders.ts';
import { Coupons } from './cms/Coupons.ts';
import { Testimonials } from './cms/Testimonials.ts';
import { Reels } from './cms/Reels.ts';
import { Pages } from './cms/Pages.ts';
import { seed } from './cms/seed.ts';

const dirname = path.resolve(__dirname);

const secret = process.env.PAYLOAD_SECRET;
if (!secret) {
  throw new Error('PAYLOAD_SECRET is missing from environment variables');
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is missing from environment variables');
}



export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Products, Categories, Orders, Coupons, Testimonials, Reels, Pages],
  editor: lexicalEditor({}),
  secret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: dbUrl,
  }),
  email: resendAdapter({
    defaultFromAddress: 'onboarding@resend.dev',
    defaultFromName: 'Memento Mori',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  plugins: [
    // Add plugins here
  ],
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SEED === 'true') {
      await seed(payload);
    }
  },
});
