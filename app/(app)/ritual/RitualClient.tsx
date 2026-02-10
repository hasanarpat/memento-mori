"use client";

import Link from "next/link";
import { useCart, useWishlist } from "@/components/ShopLayout";
import type { Product } from "@/app/data/shop";

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
          return (
            <article key={product.id} className="ritual-card home-product-card">
              <Link href={`/product/${product.id}`} className="ritual-card-image">
                <div className="home-product-image" />
                {product.badge && (
                  <span className={`product-badge ${product.badge.toLowerCase().replace(/\s/g, "-")}`}>
                    {product.badge}
                  </span>
                )}
              </Link>
              <div className="home-product-info">
                <h3 className="home-product-name">
                  <Link href={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="home-product-category">{product.category}</p>
                <p className="home-product-price">₺{product.price}</p>
                <div className="ritual-card-actions">
                  <button
                    type="button"
                    className="product-detail-btn-primary"
                    onClick={() => addToCart({
                    id: String(product.id),
                    product: {
                      ...product,
                      slug: String(product.id),
                      description: '',
                      images: [],
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
