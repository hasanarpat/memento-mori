'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist, useCart } from '@/components/ShopLayout';

type WishlistProduct = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  category?: unknown;
  images?: { url?: string } | null;
};

export default function AccountWishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const wishlistKey = wishlistIds.join(',');
  useEffect(() => {
    if (wishlistIds.length === 0) {
      queueMicrotask(() => {
        setItems([]);
        setLoading(false);
      });
      return;
    }
    setLoading(true);
    const ids = wishlistIds.join(',');
    fetch(`/api/shop/products?ids=${encodeURIComponent(ids)}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const docs = data.docs ?? data;
        const list = Array.isArray(docs) ? docs : [];
        const order = wishlistIds;
        list.sort(
          (a: WishlistProduct, b: WishlistProduct) =>
            order.indexOf(String(a.id)) - order.indexOf(String(b.id))
        );
        setItems(list);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [wishlistKey, wishlistIds]);

  if (loading) {
    return (
      <div className='account-section'>
        <div className='account-header'>
          <h1 className='account-title'>My Wishlist</h1>
          <p className='account-subtitle'>Loading...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='account-section'>
        <div className='account-header'>
          <h1 className='account-title'>My Wishlist</h1>
          <p className='account-subtitle'>
            Manage the items you love and wish to possess.
          </p>
        </div>
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
      <div className='account-header'>
        <h1 className='account-title'>My Wishlist ({items.length})</h1>
        <p className='account-subtitle'>
          Keep track of items you plan to acquire.
        </p>
      </div>
      <div
        className='wishlist-grid'
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {items.map((product) => {
          const imageUrl =
            product.images && typeof product.images === 'object' && 'url' in product.images
              ? (product.images as { url?: string }).url
              : undefined;
          const categoryLabel =
            product.category && typeof product.category === 'object' && Array.isArray(product.category)
              ? (product.category as { title?: string }[]).map((c) => c?.title ?? '').filter(Boolean).join(' × ')
              : product.category && typeof product.category === 'object' && 'title' in product.category
                ? (product.category as { title?: string }).title
                : '';
          return (
            <article key={product.id} className='wishlist-card home-product-card'>
              <Link
                href={`/product/${product.slug ?? product.id}`}
                className='wishlist-card-image-wrap'
              >
                <div
                  className='home-product-image'
                  style={{ aspectRatio: '3/4', position: 'relative' }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes='200px'
                      className='object-cover'
                      unoptimized
                    />
                  ) : null}
                </div>
                {categoryLabel ? (
                  <span className='home-product-category'>{categoryLabel}</span>
                ) : null}
              </Link>
              <div className='home-product-info'>
                <h2 className='home-product-name' style={{ fontSize: '1rem' }}>
                  <Link href={`/product/${product.slug ?? product.id}`}>{product.name}</Link>
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
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        product: {
                          id: product.id,
                          name: product.name,
                          slug: product.slug ?? product.id,
                          price: product.price,
                          images: product.images,
                        },
                        quantity: 1,
                        price: product.price,
                      })
                    }
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
          );
        })}
      </div>
    </div>
  );
}
