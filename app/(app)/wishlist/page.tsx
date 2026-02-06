"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist, useCart } from "@/components/ShopLayout";
import { products } from "@/app/data/shop";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const items = products.filter((p) => wishlistIds.includes(String(p.id)));

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <h1 className="home-section-title">Wishlist</h1>
        <div className="wishlist-empty">
          <Heart size={64} strokeWidth={1} className="wishlist-empty-icon" />
          <p className="wishlist-empty-title">Your wishlist is empty</p>
          <p className="wishlist-empty-desc">
            Save items you love by clicking the heart on product pages.
          </p>
          <Link href="/collections" className="home-cta-primary">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="home-section-title">Wishlist</h1>
      <p className="wishlist-count">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
      <div className="wishlist-grid">
        {items.map((product) => (
          <article key={product.id} className="wishlist-card home-product-card">
            <Link href={`/product/${product.id}`} className="wishlist-card-image-wrap">
              <div className="home-product-image" />
              <span className="home-product-category">{product.category}</span>
            </Link>
            <div className="home-product-info">
              <h2 className="home-product-name">
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </h2>
              <p className="home-product-price">₺{product.price}</p>
              <div className="wishlist-card-actions">
                <button
                  type="button"
                  className="product-detail-btn-primary"
                  onClick={() => addToCart()}
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="product-detail-btn-ghost wishlist-remove"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <Heart size={20} fill="currentColor" />
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
