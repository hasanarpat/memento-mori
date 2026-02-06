'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist, useCart } from '@/components/ShopLayout';
import { products } from '@/app/data/shop';

export default function AccountWishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const items = products.filter((p) => wishlistIds.includes(String(p.id)));

  if (items.length === 0) {
    return (
      <div className='account-section'>
        <h3>Wishlist</h3>
        <div className='wishlist-empty'>
          <Heart size={48} strokeWidth={1} className='wishlist-empty-icon' />
          <p className='wishlist-empty-title'>Your wishlist is empty</p>
          <p className='wishlist-empty-desc'>
            Save items you love by clicking the heart on product pages.
          </p>
          <Link href='/collections' className='home-cta-primary'>
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='account-section'>
      <h3>Wishlist ({items.length})</h3>
      <div
        className='wishlist-grid'
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {items.map((product) => (
          <article key={product.id} className='wishlist-card home-product-card'>
            <Link
              href={`/product/${product.id}`}
              className='wishlist-card-image-wrap'
            >
              <div
                className='home-product-image'
                style={{ aspectRatio: '3/4' }}
              />
              <span className='home-product-category'>{product.category}</span>
            </Link>
            <div className='home-product-info'>
              <h2 className='home-product-name' style={{ fontSize: '1rem' }}>
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </h2>
              <p className='home-product-price'>₺{product.price}</p>
              <div
                className='wishlist-card-actions'
                style={{ flexDirection: 'column', gap: '0.5rem' }}
              >
                <button
                  type='button'
                  className='product-detail-btn-primary'
                  style={{
                    width: '100%',
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                  }}
                  onClick={() => addToCart()}
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                <button
                  type='button'
                  className='product-detail-btn-ghost wishlist-remove'
                  onClick={() => toggleWishlist(product.id)}
                  aria-label='Remove from wishlist'
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  <Heart size={16} fill='currentColor' />
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
