import { getPayload } from 'payload';
import configPromise from '@payload-config';
import Link from "next/link";
import { Archive, Clock, Skull } from "lucide-react";
import { lookbookItems } from "@/app/data/shop"; // Lookbooks still static
import { buildPageMetadata } from "@/app/lib/metadata";

const archiveLookbooks = lookbookItems.filter((lb) => lb.year === "Archive");

export const metadata = buildPageMetadata({
  title: "Archive",
  description:
    "Past lookbooks and limited editions. Archive collection. Rare and discontinued pieces. Memento Mori.",
  path: "/archive",
  keywords: ["archive collection", "limited edition", "past collections", "rare gothic fashion", "memento mori archive"],
});

export default async function ArchivePage() {
  const payload = await getPayload({ config: configPromise });

  // Fetch Limited & Rare products
  const limitedProductsResult = await payload.find({
    collection: 'products',
    where: {
      badge: { in: ['limited', 'rare'] }
    },
    limit: 100,
    depth: 1,
  });

  const limitedProducts = limitedProductsResult.docs;

  const ProductCard = ({ product }: { product: any }) => {
    const categoryTitle = Array.isArray(product.category)
      ? product.category.map((c: any) => (typeof c === 'object' ? c.title : c)).join(' / ')
      : (product.category as any)?.title || product.theme;

    return (
      <Link
        key={product.id}
        href={`/product/${product.id}`}
        className="home-product-card archive-product-card"
      >
        <div className="home-product-image" />
        <div className="home-product-info">
          <span className="home-product-category">{categoryTitle}</span>
          <h3 className="home-product-name">{product.name}</h3>
          <p className="home-product-price">₺{product.price}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="archive-page">
      <section className="archive-hero">
        <Archive className="archive-hero-icon" size={56} aria-hidden="true" />
        <h1 className="home-section-title">Archive</h1>
        <p className="archive-hero-desc">
          Past seasons and limited runs. What remains when the drop is over.
        </p>
      </section>

      <section className="archive-section" aria-labelledby="archive-lookbook-heading">
        <h2 id="archive-lookbook-heading" className="archive-section-title">
          <Clock size={24} />
          Past Lookbooks
        </h2>
        {archiveLookbooks.length > 0 ? (
          <div className="archive-lookbook-grid">
            {archiveLookbooks.map((item) => (
              <Link
                key={item.id}
                href="/lookbook"
                className="archive-lookbook-card"
              >
                <div className="archive-lookbook-image" />
                <h3 className="archive-lookbook-name">{item.season}</h3>
                <p className="archive-lookbook-meta">{item.year} · {item.category}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="archive-empty">No archived lookbooks yet.</p>
        )}
      </section>

      <section className="archive-section" aria-labelledby="archive-limited-heading">
        <h2 id="archive-limited-heading" className="archive-section-title">
          Limited & Rare
        </h2>
        <p className="archive-section-desc">
          Pieces marked LIMITED or RARE. Stock is finite.
        </p>
        {limitedProducts.length > 0 ? (
          <div className="archive-products-grid">
            {limitedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="archive-empty">
            <Skull size={48} opacity={0.3} />
            <p>No limited pieces at this time.</p>
          </div>
        )}
      </section>

      <div className="archive-back">
        <Link href="/collections" className="home-cta-outline">
          All Collections
        </Link>
      </div>
    </div>
  );
}
