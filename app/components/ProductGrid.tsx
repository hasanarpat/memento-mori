'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, Skull, Moon, Cog, Flame, Sparkles, BookOpen, Box, Zap, Droplets } from 'lucide-react';
import { useCart, useWishlist } from './ShopLayout';
import QuickViewModal from './QuickViewModal';

const themeIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  gothic: Moon,
  steampunk: Cog,
  metal: Flame,
  occult: Sparkles,
  'dark-academia': BookOpen,
  industrial: Box,
  deathrock: Zap,
  ritual: Droplets,
};

interface Product {
  id: string;
  name: string;
  price: number;
  category: any;
  theme: string;
  badge?: string;
  images: any;
}

interface ProductGridProps {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <>
      <div className='products-grid'>
        {initialProducts.map((product) => {
          const Icon = themeIcons[product.theme] ?? Skull;
          const inWishlist = isInWishlist(product.id);
          const imageUrl = (product.images as any)?.url;

          return (
            <div key={product.id} className='product-card'>
              <div className='product-image'>
                <Link href={`/product/${product.slug ?? product.id}`} className='product-image-link'>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-cover'
                      unoptimized
                    />
                  ) : (
                    <div className='product-placeholder'>
                      <Icon size={36} />
                    </div>
                  )}
                </Link>
                {product.badge && product.badge !== 'none' && (
                  <div className={`product-badge ${product.badge.toLowerCase().replace(/\s/g, '-')}`}>
                    {product.badge.toUpperCase()}
                  </div>
                )}
                <div className='product-actions'>
                  <button
                    type='button'
                    className={`action-button ${inWishlist ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    <Heart
                      size={18}
                      fill={inWishlist ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    type='button'
                    className='action-button'
                    aria-label='Quick view'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewProduct(product);
                    }}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              <div className='product-info'>
                <div className='product-category'>
                  {Array.isArray(product.category) 
                    ? product.category.map((c: any) => (typeof c === 'object' ? c.title : c)).join(' × ') 
                    : (product.category as any)?.title || (typeof product.category === 'string' ? product.category : product.theme)}
                </div>
                <h3 className='product-name'>
                  <Link href={`/product/${product.slug ?? product.id}`}>{product.name}</Link>
                </h3>
                <div className='product-footer'>
                  <div className='product-price'>₺{product.price}</div>
                  <button
                    type='button'
                    className='add-to-cart'
                    onClick={() => addToCart({
                      id: product.id,
                      product: {
                        ...product,
                        slug: product.id,
                      },
                      quantity: 1,
                      price: product.price, 
                    })}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <QuickViewModal
        product={previewProduct as any}
        isOpen={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
        onAddToCart={(p) => addToCart({
          id: String(p.id),
          product: p,
          quantity: 1,
          price: p.price,
        })}
        onToggleWishlist={(id: any) => toggleWishlist(id)}
        isInWishlist={(id: any) => isInWishlist(id)}
      />
    </>
  );
}
