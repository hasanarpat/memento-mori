"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, useWishlist } from "@/components/ShopLayout";

interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  category: unknown;
  theme: string;
  badge?: string;
  images?: { url?: string } | null;
}

export default function RitualClient({ products: ritualProducts }: { products: Product[] }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (ritualProducts.length === 0) {
    return (
      <div className="ritual-empty">
        <p>Ritual offerings are being prepared. Return at the next moon.</p>
        <Link href="/collections" className="home-cta-primary">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <section className="ritual-products" aria-labelledby="ritual-heading">
      <h2 id="ritual-heading" className="sr-only">
        Ritual & altar products
      </h2>
      <div className="ritual-grid">
        {ritualProducts.map((product) => {
          const inWishlist = isInWishlist(product.id);
          const categoryTitle = Array.isArray(product.category)
            ? (product.category as { title?: string }[]).map((c) => (typeof c === 'object' ? c.title : c)).join(' / ')
            : (product.category as { title?: string } | null)?.title || product.theme;

          const imageUrl = product.images?.url;

          return (
            <article key={product.id} className="ritual-card home-product-card">
              <Link href={`/product/${product.slug ?? product.id}`} className="ritual-card-image">
                <div className="home-product-image">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes='(max-width: 768px) 100vw, 33vw'
                      className='object-cover'
                      unoptimized
                    />
                  )}
                </div>
                {product.badge && product.badge !== 'none' && (
                  <span className={`product-badge ${product.badge.toLowerCase().replace(/\s/g, "-")}`}>
                    {product.badge}
                  </span>
                )}
              </Link>
              <div className="home-product-info">
                <h3 className="home-product-name">
                  <Link href={`/product/${product.slug ?? product.id}`}>{product.name}</Link>
                </h3>
                <p className="home-product-category">{categoryTitle}</p>
                <p className="home-product-price">₺{product.price}</p>
                <div className="ritual-card-actions">
                  <button
                    type="button"
                    className="product-detail-btn-primary"
                    onClick={() => addToCart({
                      id: product.id,
                      product: {
                        ...product,
                        slug: product.id,
                        description: '',
                      },
                      quantity: 1,
                      price: product.price,
                    })}
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="product-detail-btn-ghost"
                    onClick={() => toggleWishlist(product.id)}
                    aria-pressed={inWishlist}
                  >
                    {inWishlist ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
