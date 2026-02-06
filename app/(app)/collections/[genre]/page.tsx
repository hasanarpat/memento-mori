import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { genres, products } from '../../../data/shop';
import type { GenreSlug } from '../../../data/shop';
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '../../../lib/site';
import JsonLd from '../../../components/JsonLd';
import GenreCollectionClient from './GenreCollectionClient';

export async function generateStaticParams() {
  return genres.map((g) => ({ genre: g.slug }));
}

function getGenre(slug: string) {
  return genres.find((g) => g.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ genre: string }>;
}): Promise<Metadata> {
  const { genre: genreSlug } = await params;
  const genre = getGenre(genreSlug);
  if (!genre) return { title: 'Collection' };

  const title = `${genre.name} Collection — ${genre.tagline}`;
  const description =
    `${genre.shortDesc} Shop ${genre.name} fashion and accessories. ` +
    `Dark fashion, subculture apparel. ${SITE_NAME}.`;
  const url = absoluteUrl(`/collections/${genre.slug}`);

  return {
    title,
    description,
    keywords: [
      genre.name.toLowerCase(),
      'gothic fashion',
      'dark fashion',
      'subculture',
      'memento mori',
      genre.tagline,
    ],
    openGraph: {
      title: `${genre.name} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${genre.name} collection`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${genre.name} Collection | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: { canonical: url },
  };
}

export default async function GenreCollectionPage({
  params,
}: {
  params: Promise<{ genre: string }>;
}) {
  const { genre: genreSlug } = await params;
  const genre = getGenre(genreSlug);
  if (!genre) notFound();

  const genreProducts = products.filter((p) => p.theme === genreSlug);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${genre.name} Collection`,
    description: genre.shortDesc,
    url: absoluteUrl(`/collections/${genre.slug}`),
    numberOfItems: genreProducts.length,
    itemListElement: genreProducts.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/product/${p.id}`),
      name: p.name,
    })),
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
        name: genre.name,
        item: absoluteUrl(`/collections/${genre.slug}`),
      },
    ],
  };

  return (
    <div className='genre-page'>
      <JsonLd data={[itemListJsonLd, breadcrumbJsonLd]} />
      <nav className='legal-breadcrumb' aria-label='Breadcrumb'>
        <Link href='/'>Home</Link>
        <span aria-hidden='true'> / </span>
        <Link href='/collections'>Collections</Link>
        <span aria-hidden='true'> / </span>
        <span>{genre.name}</span>
      </nav>
      <section
        className='genre-hero'
        style={{ '--genre-accent': genre.accent } as React.CSSProperties}
      >
        <h1 className='genre-hero-title'>{genre.name}</h1>
        <p className='genre-hero-tagline'>{genre.tagline}</p>
        <p className='genre-hero-desc'>{genre.longDesc}</p>
      </section>
      <GenreCollectionClient
        genreSlug={genre.slug as GenreSlug}
        genreName={genre.name}
        genreProducts={genreProducts}
      />
    </div>
  );
}
