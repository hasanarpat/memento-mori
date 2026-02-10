import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import path from 'path';
import sharp from 'sharp';

import { Users } from './cms/Users';
import { Media } from './cms/Media';
import { Products } from './cms/Products';
import { Categories } from './cms/Categories';
import { Orders } from './cms/Orders';
import { seed } from './cms/seed';

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
  collections: [Users, Media, Products, Categories, Orders],
  editor: lexicalEditor({}),
  secret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: dbUrl,
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
