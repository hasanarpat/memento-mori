"use client";

import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist, useCart } from "@/components/ShopLayout";
import { products } from "@/app/data/shop";

const getProductImage = (id: number) =>
  `https://picsum.photos/600/750?random=${id}`;

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const items = products.filter((p) => wishlistIds.includes(String(p.id)));

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <header className="wishlist-header">
          <h1 className="wishlist-title">Wishlist</h1>
          <p className="wishlist-subtitle">Items you’ve saved for later</p>
        </header>
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon-wrap">
            <Heart size={56} strokeWidth={1.2} className="wishlist-empty-icon" />
          </div>
          <h2 className="wishlist-empty-title">Your wishlist is empty</h2>
          <p className="wishlist-empty-desc">
            Save items you love by clicking the heart on product or collection pages.
          </p>
          <Link href="/collections" className="wishlist-empty-cta">
            <span>Explore Collections</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <nav className="wishlist-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>/</span>
          <span>Wishlist</span>
        </nav>
        <h1 className="wishlist-title">Wishlist</h1>
        <p className="wishlist-count">
          {items.length} item{items.length !== 1 ? "s" : ""} saved
        </p>
      </header>
      <div className="wishlist-grid">
        {items.map((product) => (
          <article key={product.id} className="wishlist-card">
            <div className="wishlist-card-image-wrap">
              <Link href={`/product/${product.id}`} className="wishlist-card-image-link">
                <img
                  src={getProductImage(product.id)}
                  alt=""
                  className="wishlist-card-image"
                />
                <span className="wishlist-card-category">{product.category}</span>
              </Link>
              <button
                type="button"
                className="wishlist-card-remove"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Remove from wishlist"
              >
                <Heart size={20} fill="currentColor" />
              </button>
            </div>
            <div className="wishlist-card-body">
              <h2 className="wishlist-card-name">
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </h2>
              <p className="wishlist-card-price">₺{product.price}</p>
              <div className="wishlist-card-actions">
                <button
                  type="button"
                  className="wishlist-card-btn-primary"
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
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="wishlist-card-btn-ghost"
                  onClick={() => toggleWishlist(product.id)}
                >
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
