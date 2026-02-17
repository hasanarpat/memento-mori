import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { buildPageMetadata } from '@/app/lib/metadata';
import NewArrivalsClient from './NewArrivalsClient';

export const metadata = buildPageMetadata({
  title: 'New Arrivals',
  description: 'Fresh from the forge. Explore our latest dark fashion artifacts and subculture essentials.',
  path: '/new-arrivals',
});

export default async function NewArrivalsPage() {
  const payload = await getPayload({ config: configPromise });

  const productsResult = await payload.find({
    collection: 'products',
    where: {
      isNewArrival: { equals: true },
    },
    sort: '-createdAt',
    limit: 100,
    depth: 1,
  });

  const products = productsResult.docs;

  // Grouping logic
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thisWeek = products.filter(p => new Date(p.createdAt) >= oneWeekAgo);
  const lastWeek = products.filter(p => {
    const d = new Date(p.createdAt);
    return d < oneWeekAgo && d >= twoWeeksAgo;
  });
  const thisMonth = products.filter(p => {
    const d = new Date(p.createdAt);
    return d < twoWeeksAgo && d >= oneMonthAgo;
  });

  // Fetch all categories for filter
  const categoriesResult = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
  });

  return (
    <NewArrivalsClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thisWeek={thisWeek as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lastWeek={lastWeek as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thisMonth={thisMonth as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories={categoriesResult.docs as any}
    />
  );
}
