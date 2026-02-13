import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import JsonLd from '../../../components/JsonLd';
import CollectionFilters from '../../../components/CollectionFilters';
import CollectionSort from '../../../components/CollectionSort';
import ProductGrid from '../../../components/ProductGrid';
import { absoluteUrl } from '../../../lib/site';

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
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GenreCollectionPage({
  params,
  searchParams,
}: PageProps) {
  const { genre: genreSlug } = await params;
  const urlParams = await searchParams;
  const payload = await getPayload({ config: configPromise });

  // 1. Fetch Genre/Category Metadata
  const categoryResult = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: genreSlug }
    },
    limit: 1,
  });

  if (categoryResult.docs.length === 0) notFound();
  const genre = categoryResult.docs[0];

  // 2. Build Filter Logic
  const type = typeof urlParams.type === 'string' ? urlParams.type : 'all';
  const minPrice = parseInt(typeof urlParams.minPrice === 'string' ? urlParams.minPrice : '0', 10);
  const maxPrice = parseInt(typeof urlParams.maxPrice === 'string' ? urlParams.maxPrice : '2000', 10);
  const sort = typeof urlParams.sort === 'string' ? urlParams.sort : '-createdAt';

  const where: any = {
    and: [
      { 'category.slug': { equals: genreSlug } },
      { price: { greater_than_equal: minPrice } },
      { price: { less_than_equal: maxPrice } },
    ]
  };

  if (type !== 'all') {
    where.and.push({ productType: { equals: type } });
  }

  // 3. Fetch Products
  const productsResult = await payload.find({
    collection: 'products',
    where,
    sort,
    depth: 1,
    limit: 100,
  });

  // 4. Fetch All Categories for sidebar (optional, or we could just show the current one's sidebar)
  const { docs: allCategories } = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
  });

  const genreProducts = productsResult.docs;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${genre.title} Collection`,
    description: genre.shortDesc,
    url: absoluteUrl(`/collections/${genre.slug}`),
    numberOfItems: productsResult.totalDocs,
    itemListElement: genreProducts.slice(0, 20).map((p: any, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/product/${p.slug ?? p.id}`),
      name: p.name,
    })),
  };

  return (
    <div className='collections-page category-inner-page'>
      <JsonLd data={[itemListJsonLd]} />
      
      <CollectionFilters 
        categories={allCategories as any} 
        productTypes={productTypeOptions}
      />

      <div className='collections-main'>
        <section
          className='genre-hero'
          style={{ '--genre-accent': (genre as any).accent || 'var(--blood-red)' } as React.CSSProperties}
        >
          <div className='breadcrumb'>Home / Collections / {genre.title}</div>
          <h1 className='genre-hero-title'>{genre.title}</h1>
          <p className='genre-hero-tagline'>{(genre as any).tagline}</p>
          <p className='genre-hero-desc'>{(genre as any).longDesc}</p>
        </section>

        <div className='collections-toolbar'>
          <div className='product-count'>
            {productsResult.totalDocs} items found in this realm
          </div>
          <CollectionSort />
        </div>

        <ProductGrid initialProducts={genreProducts as any} />
      </div>
    </div>
  );
}
