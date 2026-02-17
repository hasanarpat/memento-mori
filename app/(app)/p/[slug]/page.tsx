import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { buildPageMetadata } from '@/app/lib/metadata';
import PageRichText from '@/app/components/PageRichText';
import ProductGrid from '@/app/components/ProductGrid';

type Block = {
  blockType: string;
  id?: string;
  content?: { root?: { children?: unknown[] } };
  blockTitle?: string;
  products?: unknown[] | { id: string; slug?: string; name: string; price: number; category?: unknown; theme?: string; badge?: string; images?: { url?: string } }[];
  layout?: string;
  heading?: string;
  subheading?: string;
  image?: { url?: string } | string | null;
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  });
  const page = result.docs[0];
  if (!page) return { title: 'Sayfa bulunamadı' };
  return buildPageMetadata({
    title: page.title,
    description: `Memento Mori — ${page.title}`,
    path: `/p/${slug}`,
  });
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  });

  const page = result.docs[0];
  if (!page) notFound();

  const layout = (page.layout as Block[] | undefined) ?? [];

  return (
    <main className="dynamic-page">
      <div className="dynamic-page__inner">
        {layout.map((block, index) => {
          if (block.blockType === 'content' && block.content) {
            return (
              <section key={block.id ?? index} className="dynamic-page__block dynamic-page__content">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <PageRichText content={block.content as any} />
              </section>
            );
          }

          if (block.blockType === 'productGrid' && block.products && Array.isArray(block.products)) {
            const products = block.products as { id: string; slug?: string; name: string; price: number; category?: unknown; theme?: string; badge?: string; images?: { url?: string } }[];
            return (
              <section key={block.id ?? index} className="dynamic-page__block dynamic-page__products">
                {block.blockTitle && (
                  <h2 className="dynamic-page__block-title">{block.blockTitle}</h2>
                )}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <ProductGrid initialProducts={products as any} />
              </section>
            );
          }

          if (block.blockType === 'hero') {
            const imageUrl =
              block.image && typeof block.image === 'object' && block.image && 'url' in block.image
                ? (block.image as { url?: string }).url
                : null;
            return (
              <section key={block.id ?? index} className="dynamic-page__block dynamic-page__hero">
                {imageUrl && (
                  <div className="dynamic-page__hero-bg">
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="dynamic-page__hero-img"
                      priority
                      unoptimized
                    />
                  </div>
                )}
                <div className="dynamic-page__hero-content">
                  <h1 className="dynamic-page__hero-heading">{block.heading ?? ''}</h1>
                  {block.subheading && (
                    <p className="dynamic-page__hero-subheading">{block.subheading}</p>
                  )}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </main>
  );
}
