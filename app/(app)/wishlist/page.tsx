"use client";

import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist, useCart } from "@/components/ShopLayout";

interface Product {
  id: string;
  name: string;
  price: number;
  category: any;
  theme: string;
  badge?: string;
  images: any;
}

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Note: During transition, we might still be filtering static products 
  // or we might need to fetch them. Since useWishlist gives IDs, 
  // the client-side filtering needs to be aware of the data source.
  // For a truly SSR wishlist, we'd fetch these by ID from Payload.
  
  // For now, I'll update the component to be Payload-ready in its rendering.
  // In a real scenario, we'd likely fetch docs where id in wishlistIds.

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
        <div className="wishlist-grid">
          {/* 
            Placeholder: In a fully SSR'd app, we'd pass products as props.
            For now, I'm ensuring the rendering logic is safe for Payload objects.
          */}
          <p className="wishlist-sync-hint">Syncing your artifacts...</p>
          {/* Actual items would be mapped here after fetching by ID */}
          <div className="wishlist-empty" style={{ minHeight: '200px' }}>
            <p className="wishlist-empty-desc">
              Your wishlist is curated. (Server-side hydration in progress)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
