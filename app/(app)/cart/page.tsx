'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon } from '../../lib/redux/slices/cartSlice';
import AvailableCoupons from '../../components/AvailableCoupons';

type RecommendedProduct = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  images?: { url?: string } | null;
};

function CartLoadingSkeleton() {
  return (
    <div className='cart-page'>
      <div className='cart-loading-skeleton'>
        <div className='cart-loading-title' />
        <div className='cart-loading-layout'>
          <div className='cart-loading-items'>
            {[1, 2].map((i) => (
              <div key={i} className='cart-loading-item'>
                <div className='cart-loading-thumb' />
                <div className='cart-loading-details'>
                  <div className='cart-loading-line cart-loading-name' />
                  <div className='cart-loading-line cart-loading-meta' />
                  <div className='cart-loading-qty' />
                </div>
                <div className='cart-loading-prices' />
              </div>
            ))}
          </div>
          <div className='cart-loading-sidebar'>
            <div className='cart-loading-summary' />
          </div>
        </div>
      </div>
    </div>
  );
}

function CartEmptyWithRecommended() {
  const [recommended, setRecommended] = useState<RecommendedProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/shop/products?limit=4&depth=1')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const docs = data.docs ?? data;
        setRecommended(Array.isArray(docs) ? docs : []);
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='cart-empty'>
      <ShoppingBag className='cart-empty-icon' size={80} />
      <h1 className='cart-empty-title'>Your cart is empty</h1>
      <Link href='/collections' className='home-cta-primary'>
        Start Shopping
      </Link>
      <div className='cart-recommended'>
        <h2 className='home-section-title'>Recommended</h2>
        <div className='home-products-grid'>
          {recommended.map((p) => {
            const imageUrl =
              p.images && typeof p.images === 'object' && 'url' in p.images
                ? (p.images as { url?: string }).url
                : undefined;
            return (
              <Link
                key={p.id}
                href={`/product/${p.slug ?? p.id}`}
                className='home-product-card'
              >
                <div className='home-product-image'>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={p.name}
                      fill
                      sizes='(max-width: 768px) 50vw, 25vw'
                      className='object-cover'
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className='home-product-info'>
                  <h3 className='home-product-name'>{p.name}</h3>
                  <p className='home-product-price'>₺{p.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CartSummaryContent({
  total,
  appliedCoupon,
  discount,
  onApplyCoupon,
  onRemoveCoupon
}: {
  total: number;
  appliedCoupon: string | null;
  discount: number;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}) {
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      onApplyCoupon(couponInput.trim().toUpperCase());
    }
  };

  const finalTotal = total - discount;

  return (
    <>
      <h2 className='cart-summary-title'>Order Summary</h2>
      <div className='cart-summary-row'>
        <span>Subtotal</span>
        <span>₺{total.toFixed(2)}</span>
      </div>
      {appliedCoupon && (
        <div className='cart-summary-row cart-summary-discount'>
          <span>
            Coupon ({appliedCoupon})
            <button
              type='button'
              onClick={onRemoveCoupon}
              className='cart-coupon-remove'
              aria-label='Remove coupon'
            >
              <X size={14} />
            </button>
          </span>
          <span className='discount-amount'>-₺{discount.toFixed(2)}</span>
        </div>
      )}
      <div className='cart-summary-row'>
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div className='cart-summary-row'>
        <span>Tax</span>
        <span>—</span>
      </div>
      <div className='cart-summary-row cart-summary-total'>
        <span>Total</span>
        <span>₺{finalTotal.toFixed(2)}</span>
      </div>
      <div className='cart-coupon'>
        <input
          type='text'
          placeholder='Coupon code'
          className='cart-coupon-input'
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
        />
        <button type='button' className='cart-coupon-btn' onClick={handleApplyCoupon}>
          Apply
        </button>
      </div>
      <Link href='/checkout' className='cart-checkout-btn'>
        Proceed to Checkout
      </Link>
      <Link href='/collections' className='cart-continue-link'>
        Continue Shopping
      </Link>
    </>
  );
}

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartLoading = useAppSelector((state) => state.cart.loading);
  const { user, isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth);
  const coupon = useAppSelector((state) => state.cart.coupon);

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('payload-token');
  const isLoading = (hasToken && authLoading) || (isAuthenticated && cartLoading);
  const isEmpty = !isLoading && cartItems.length === 0;

  const [couponError, setCouponError] = useState<string | null>(null);

  const handleRemoveItem = (id: string | number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleApplyCoupon = async (code: string) => {
    try {
      setCouponError(null);
      const res = await fetch('/api/shop/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          orderAmount: total,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Invalid coupon code');
        return;
      }

      dispatch(applyCoupon({ code, discountAmount: data.coupon.discountAmount }));
    } catch {
      setCouponError('Failed to apply coupon');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponError(null);
  };

  return (
    <div className='cart-page'>
      {isLoading ? (
        <CartLoadingSkeleton />
      ) : isEmpty ? (
        <CartEmptyWithRecommended />
      ) : (
        <>
          <h1 className='cart-title'>Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
          <div className='cart-layout'>
            <div className='cart-items'>
              {cartItems.map((item) => (
                <div key={item.id} className='cart-item'>
                  <Link
                    href={`/product/${item.product.slug ?? item.id}`}
                    className='cart-item-thumb-link'
                    aria-label={`View ${item.product.name}`}
                  >
                    <div
                      className='cart-item-thumb'
                      style={{
                        width: 100,
                        height: 100,
                        background: (() => {
                          const img = item.product.images;
                          const url = Array.isArray(img)
                            ? img[0]?.url
                            : (img as { url?: string } | null)?.url;
                          return url
                            ? `url(${url}) center/cover`
                            : 'rgba(26,10,31,0.8)';
                        })(),
                        border: '2px solid rgba(139,115,85,0.3)',
                      }}
                    />
                  </Link>
                  <div className='cart-item-details'>
                    <Link
                      href={`/product/${item.product.slug ?? item.id}`}
                      className='cart-item-name-link'
                    >
                      <h3 className='cart-item-name'>{item.product.name}</h3>
                    </Link>
                    <p className='cart-item-meta'>
                      {item.product.productType && item.product.theme
                        ? `${item.product.productType} · ${item.product.theme}`
                        : item.product.productType || item.product.theme || 'Product'}
                    </p>
                    <div className='cart-item-qty'>
                      <button
                        type='button'
                        aria-label='Decrease'
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type='button'
                        aria-label='Increase'
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className='cart-item-prices'>
                    <span className='cart-item-unit'>₺{item.price.toFixed(2)}</span>
                    <span className='cart-item-total'>
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button
                    type='button'
                    className='cart-item-remove'
                    aria-label='Remove item'
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
            <aside className='cart-sidebar'>
              {couponError && (
                <div className='cart-coupon-error'>{couponError}</div>
              )}
              <AvailableCoupons onApplyCoupon={handleApplyCoupon} />
              <div className='cart-summary-standalone cart-summary'>
                <CartSummaryContent
                  total={total}
                  appliedCoupon={coupon?.code ?? null}
                  discount={coupon?.discountAmount ?? 0}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />
              </div>
              <details className='cart-summary-collapse' open>
                <summary>
                  Order Summary — ₺{(total - (coupon?.discountAmount ?? 0)).toFixed(2)}
                </summary>
                <div className='cart-summary'>
                  <CartSummaryContent
                    total={total}
                    appliedCoupon={coupon?.code ?? null}
                    discount={coupon?.discountAmount ?? 0}
                    onApplyCoupon={handleApplyCoupon}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                </div>
              </details>
            </aside>
          </div>
          <div className='cart-trust'>
            <span>Secure payment</span>
            <span>Free returns</span>
            <span>24/7 support</span>
          </div>
        </>
      )}
    </div>
  );
}
