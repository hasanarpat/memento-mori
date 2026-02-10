import { Payload } from 'payload';
import path from 'path';
import fs from 'fs';
import { genres, products } from '../app/data/shop';

const demoUser = {
  email: 'demo@memento.com',
  password: 'demodemo',
  name: 'Demo',
  surname: 'User',
  roles: ['admin'],
};

// Helper to generate basic Lexical JSON structure
const generateLexicalDescription = (text: string) => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding database...');

  // 1. Clear Data
  await payload.delete({ collection: 'products', where: { id: { exists: true } } });
  await payload.delete({ collection: 'orders', where: { id: { exists: true } } });
  await payload.delete({ collection: 'media', where: { id: { exists: true } } });
  await payload.delete({ collection: 'categories', where: { id: { exists: true } } });
  await payload.delete({ collection: 'users', where: { email: { equals: demoUser.email } } });

  // 2. Create Media
  console.log('Seed: Current Working Directory:', process.cwd());
  const mediaDir = path.join(process.cwd(), 'public');
  console.log('Seed: Resolved Media Dir:', mediaDir);
  
  const files = ['atlas-conan.jpg', 'chateau.jpg', 'symbol.png', 'window.png'];
  const mediaDocs = [];

  if (fs.existsSync(mediaDir)) {
      console.log('Seed: Media files found:', fs.readdirSync(mediaDir));
      
      for (const file of files) {
          const filePath = path.join(mediaDir, file);
          if (fs.existsSync(filePath)) {
              try {
                  // Create a temporary copy of the file to avoid locking/permission issues in public dir
                  const tempDir = path.join(process.cwd(), 'tmp-seed');
                  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
                  
                  const tempFilePath = path.join(tempDir, file);
                  fs.copyFileSync(filePath, tempFilePath);

                  const mediaDoc = await payload.create({
                      collection: 'media',
                      data: { alt: file },
                      file: {
                          path: tempFilePath,
                          name: file,
                          mimetype: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
                          size: fs.statSync(tempFilePath).size,
                      } as any,
                  });
                  mediaDocs.push(mediaDoc);
                  console.log(`Created media: ${file}`);
                  
                  // Cleanup temp file
                  try { fs.unlinkSync(tempFilePath); } catch (e) {}
              } catch (e) {
                  console.error(`Failed to create media ${file}:`, e);
              }
          } else {
             console.warn(`File not found: ${filePath}`);
          }
      }
  } else {
     console.error('Seed: Media directory NOT FOUND at:', mediaDir);
  }

  // 3. Create Categories (Genres)
  const categoryMap = new Map<string, string>(); // slug -> ID

  for (const genre of genres) {
      try {
          const doc = await payload.create({
              collection: 'categories',
              data: {
                  title: genre.name,
                  slug: genre.slug,
                  tagline: genre.tagline,
                  shortDesc: genre.shortDesc,
                  longDesc: genre.longDesc,
                  accent: genre.accent,
                  icon: genre.icon,
              },
          });
          categoryMap.set(genre.name.toLowerCase(), doc.id as string);
          // Also map individual words for "Gothic × Metal" splitting
          const parts = genre.name.toLowerCase().split(' ');
          parts.forEach(part => categoryMap.set(part, doc.id as string));
          
          console.log(`Created category: ${genre.name}`);
      } catch (e) {
          console.error(`Failed to create category ${genre.name}:`, e);
      }
  }

  // 4. Create Products
  if (categoryMap.size > 0 && mediaDocs.length > 0) {
      for (const product of products) {
          // Determine categories form "Gothic × Metal" string
          const productCategories: string[] = [];
          
          const catNames = product.category.split(' × ');
          for (const catName of catNames) {
              const key = catName.trim().toLowerCase();
              if (categoryMap.has(key)) {
                  productCategories.push(categoryMap.get(key)!);
              }
          }

          // Fallback to theme if no categories resolved
          if (productCategories.length === 0) {
             const genre = genres.find(g => g.slug === product.theme);
             if (genre && categoryMap.has(genre.name.toLowerCase())) {
                 productCategories.push(categoryMap.get(genre.name.toLowerCase())!);
             }
          }
          
          // Random Image
          const randomImage = mediaDocs[Math.floor(Math.random() * mediaDocs.length)];
          const descText = `A ${product.badge ? product.badge.toLowerCase() : 'unique'} piece from the ${product.category} collection. Perfect for your ${product.theme} aesthetic.`;

          try {
              await payload.create({
                  collection: 'products',
                  data: {
                      name: product.name,
                      slug: product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                      price: product.price,
                      description: generateLexicalDescription(descText), // Use helper for Lexical format
                      category: productCategories,
                      productType: product.productType,
                      theme: product.theme,
                      images: randomImage.id,
                      stock: Math.floor(Math.random() * 50) + 1,
                      isNewArrival: product.new,
                      badge: product.badge ? product.badge.toLowerCase() : null,
                  },
              });
              console.log(`Created product: ${product.name}`);
          } catch (e) {
              console.error(`Failed to create product ${product.name}:`, e);
          }
      }
  } else {
     console.warn('Skipping product creation: No categories or media found.');
  }

  // 5. Create Demo User
  await payload.create({
    collection: 'users',
    data: demoUser,
  });

  payload.logger.info('Seeding complete!');
};
