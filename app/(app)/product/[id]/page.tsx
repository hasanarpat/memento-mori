import { notFound } from 'next/navigation';
import { products } from '../../../data/shop';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from '../../../lib/site';
import JsonLd from '../../../components/JsonLd';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

function getProduct(id: number) {
  return products.find((p) => p.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) return { title: 'Product Not Found' };

  const title = `${product.name} | ${product.category}`;
  const description =
    `${product.name} — ${product.category}. ₺${product.price}. ` +
    `Dark fashion & subculture. ${product.badge ? `${product.badge}. ` : ''}Shop Memento Mori.`;
  const url = absoluteUrl(`/product/${product.id}`);
  const image = DEFAULT_OG_IMAGE; // In production, use product image URL

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category,
      product.theme,
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
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = getProduct(productId);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: `${product.name} — ${product.category}. Dark fashion, subculture apparel.`,
    image: DEFAULT_OG_IMAGE,
    url: absoluteUrl(`/product/${product.id}`),
    sku: String(product.id),
    category: product.category,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/product/${product.id}`),
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: `${SITE_URL}/collections`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: absoluteUrl(`/product/${product.id}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
