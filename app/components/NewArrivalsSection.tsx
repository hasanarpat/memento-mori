'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  category: any;
  theme: string;
  isNewArrival?: boolean;
  badge?: string;
  images: any;
}

interface NewArrivalsSectionProps {
  initialProducts: Product[];
  totalPages: number;
  initialPage: number;
}

export default function NewArrivalsSection({
  initialProducts,
  totalPages,
  initialPage,
}: NewArrivalsSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(page < totalPages);
  
  const observerTarget = useRef(null);

  const fetchMoreProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(`/api/shop/products?isNew=true&limit=8&page=${nextPage}`);
      const data = await res.json();

      if (data.docs) {
        setProducts((prev) => [...prev, ...data.docs]);
        setPage(nextPage);
        setHasMore(nextPage < data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching more products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  return (
    <section className='home-new-arrivals-wrap' aria-labelledby='new-arrivals-heading'>
      <div className='home-new-arrivals-header'>
        <h2 id='new-arrivals-heading' className='home-new-arrivals-title'>
          New Arrivals
        </h2>
        <Link href='/new-arrivals' className='home-view-all'>
          View All
        </Link>
      </div>
      
      <div className='home-products-grid'>
        {products.map((product) => {
          const imageUrl = (product.images as any)?.url;
          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className='home-product-card'
            >
              <div className='home-product-image'>
                {imageUrl && (
                  <Image 
                    src={imageUrl} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized
                  />
                )}
                {product.badge && product.badge !== 'none' && (
                  <span className='home-product-badge'>{product.badge.toUpperCase()}</span>
                )}
                {product.isNewArrival && (!product.badge || product.badge === 'none') && (
                  <span className='home-product-badge'>NEW</span>
                )}
              </div>
              <div className='home-product-info'>
                <h3 className='home-product-name'>{product.name}</h3>
                <p className='home-product-category'>
                  {Array.isArray(product.category) 
                    ? product.category.map((c: any) => c.title).join(' × ') 
                    : (product.category as any)?.title || product.theme}
                </p>
                <p className='home-product-price'>₺{product.price}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div ref={observerTarget} className='flex justify-center py-8'>
          {loading && (
             <div className="flex items-center space-x-2 text-gray-400">
               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
             </div>
          )}
        </div>
      )}
    </section>
  );
}
