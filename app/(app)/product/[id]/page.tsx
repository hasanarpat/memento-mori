import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '../../../lib/site';
import JsonLd from '../../../components/JsonLd';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';
import type { Product } from './types';
import { getCategoryTitle, getProductImageUrl, getCategoryIds } from './types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

async function getProduct(slugOrId: string) {
  const payload = await getPayload({ config: configPromise });
  if (OBJECT_ID_REGEX.test(slugOrId)) {
    try {
      const doc = await payload.findByID({
        collection: 'products',
        id: slugOrId,
        depth: 1,
      });
      return doc;
    } catch {
      return null;
    }
  }
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slugOrId } },
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: slug } = await params;

  try {
    const product = await getProduct(slug);

    if (!product) return { title: 'Product Not Found' };

    const categoryTitle = getCategoryTitle(product.category, 'Artifact');
    const title = `${product.name} | ${categoryTitle} — ${SITE_NAME}`;
    const description = `${product.name} — ${categoryTitle}. ₺${product.price}. Dark fashion & subculture artifacts.`;
    const url = absoluteUrl(`/product/${product.slug}`);
    const image = getProductImageUrl(product.images) || DEFAULT_OG_IMAGE;

    return {
      title,
      description,
      keywords: [
        product.name,
        categoryTitle,
        String(product.theme),
        'gothic fashion',
        'dark fashion',
        'memento mori',
      ],
      openGraph: {
        title: `${product.name} | ${SITE_NAME}`,
        description,
        url,
        siteName: SITE_NAME,
        images: [{ url: image, width: 1200, height: 630, alt: product.name }],
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | ${SITE_NAME}`,
        description,
        images: [image],
      },
      alternates: { canonical: url },
      other: {
        'product:price:amount': String(product.price),
        'product:price:currency': 'TRY',
      },
    };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id: slug } = await params;

  const product = await getProduct(slug);
  if (!product) notFound();

  // Fetch Related Products (same category, excluding current)
  const payload = await getPayload({ config: configPromise });
  const categoryIds = getCategoryIds(product.category);

  const relatedResult = await payload.find({
    collection: 'products',
    where: {
      and: [
        { id: { not_equals: product.id } },
        { category: { in: categoryIds } },
      ],
    },
    limit: 6,
    depth: 1,
  });

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: `${product.name}. Dark fashion, subculture apparel.`,
    image: getProductImageUrl(product.images) || DEFAULT_OG_IMAGE,
    url: absoluteUrl(`/product/${product.slug}`),
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: 'TRY',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: absoluteUrl('/collections'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: absoluteUrl(`/product/${product.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <ProductDetailClient
        product={product as Product}
        related={relatedResult.docs as Product[]}
      />
    </>
  );
}
