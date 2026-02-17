"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/components/ShopLayout";
import ProductGrid from "@/app/components/ProductGrid";



export default function WishlistPage() {
  const { wishlistIds, wishlistProducts } = useWishlist();

  // Create a display list of products
  // We use the full product objects from Redux if available
  // Fallback to empty if loading or not found
  const displayProducts = wishlistProducts.map(p => ({
    ...p,
    // Ensure category is compatible with Product interface if needed
    category: p.category || 'unknown'
  }));

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
          {wishlistIds.length} item{wishlistIds.length !== 1 ? "s" : ""} saved
        </p>
      </header>

      {wishlistIds.length === 0 ? (
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
      ) : (
        <div className="wishlist-content">
          {/* Note: In a real app we might want a loading state here if products are missing but IDs exist */}
          {wishlistProducts.length > 0 ? (
            <ProductGrid initialProducts={displayProducts} />
          ) : (
            <div className="wishlist-loading">
              <p>Loading your artifacts...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
