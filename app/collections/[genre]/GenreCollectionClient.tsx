"use client";

import Link from "next/link";
import { useWishlist, useCart } from "@/app/components/ShopLayout";
import type { Product } from "@/app/data/shop";

export default function GenreCollectionClient({
  genreSlug,
  genreName,
  genreProducts,
}: {
  genreSlug: string;
  genreName: string;
  genreProducts: Product[];
}) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (genreProducts.length === 0) {
    return (
      <div className="genre-empty">
        <p>No artifacts in this realm yet. Check back soon.</p>
        <Link href="/collections" className="home-cta-primary">
          All Collections
        </Link>
      </div>
    );
  }

  return (
    <section className="genre-products" aria-labelledby="genre-products-heading">
      <h2 id="genre-products-heading" className="sr-only">
        {genreName} products
      </h2>
      <p className="genre-count">{genreProducts.length} artifact{genreProducts.length !== 1 ? "s" : ""}</p>
      <div className="genre-grid">
        {genreProducts.map((product) => {
          const inWishlist = isInWishlist(product.id);
          return (
            <article key={product.id} className="genre-product-card home-product-card">
              <Link href={`/product/${product.id}`} className="genre-card-image-wrap">
                <div className="home-product-image" />
                <span className="home-product-category">{product.category}</span>
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
                <p className="home-product-price">₺{product.price}</p>
                <div className="genre-card-actions">
                  <button
                    type="button"
                    className="product-detail-btn-primary"
                    onClick={() => addToCart()}
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="product-detail-btn-ghost"
                    onClick={() => toggleWishlist(product.id)}
                    aria-pressed={inWishlist}
                    title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
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
