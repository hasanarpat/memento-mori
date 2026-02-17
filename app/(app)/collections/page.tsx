import { Suspense } from 'react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import CollectionFilters from '../../components/CollectionFilters';
import CollectionSort from '../../components/CollectionSort';
import ProductGrid from '../../components/ProductGrid';

const productTypeOptions = [
  { label: 'Apparel', value: 'apparel' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Jewelry', value: 'jewelry' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Footwear', value: 'footwear' },
  { label: 'Ritual', value: 'ritual' },
  { label: 'Harness', value: 'harness' },
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollectionsPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config: configPromise });
  const params = await searchParams;

  const genre = typeof params.genre === 'string' ? params.genre : 'all';
  const type = typeof params.type === 'string' ? params.type : 'all';
  const minPrice = parseInt(typeof params.minPrice === 'string' ? params.minPrice : '0', 10);
  const maxPrice = parseInt(typeof params.maxPrice === 'string' ? params.maxPrice : '2000', 10);
  const sort = typeof params.sort === 'string' ? params.sort : '-createdAt';

  // 1. Fetch Categories for sidebar
  const { docs: categories } = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
  });

  // 2. Build filter (where) clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: { and: any[] } = {
    and: [
      { price: { greater_than_equal: minPrice } },
      { price: { less_than_equal: maxPrice } },
    ]
  };

  if (genre !== 'all') {
    // Match by category slug (assuming depth=1 brings category objects)
    where.and.push({
      'category.slug': {
        equals: genre,
      }
    });
  }

  if (type !== 'all') {
    where.and.push({
      productType: {
        equals: type,
      }
    });
  }

  // 3. Fetch Products
  const productsResult = await payload.find({
    collection: 'products',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: where as any,
    sort,
    depth: 1,
    limit: 100, // For now, we fetch a large batch for simplicity, or we could add pagination
  });

  return (
    <div className='collections-page'>
      <Suspense fallback={<div className="filters-sidebar-loading" />}>
        <CollectionFilters
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          categories={categories as any}
          productTypes={productTypeOptions}
        />
      </Suspense>

      <div className='collections-main'>
        <div className='collections-toolbar'>
          <div>
            <div className='breadcrumb'>Home / Collections</div>
            <div className='product-count' style={{ marginTop: '0.5rem' }}>
              {productsResult.totalDocs} items found
            </div>
          </div>

          <Suspense fallback={<div className="sort-loading" />}>
            <CollectionSort />
          </Suspense>
        </div>

        <ProductGrid initialProducts={productsResult.docs as { id: string; slug?: string; name: string; price: number; category: unknown; theme: string; badge?: string; images?: { url?: string } | null }[]} />
      </div>
    </div>
  );
}
