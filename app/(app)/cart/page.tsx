'use client';

import Link from 'next/link';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import { removeFromCart, updateQuantity } from '../../lib/redux/slices/cartSlice';
import { products } from '../../data/shop';

function CartSummaryContent({ total }: { total: number }) {
  return (
    <>
      <h2 className='cart-summary-title'>Order Summary</h2>
      <div className='cart-summary-row'>
        <span>Subtotal</span>
        <span>₺{total.toFixed(2)}</span>
      </div>
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
        <span>₺{total.toFixed(2)}</span>
      </div>
      <div className='cart-coupon'>
        <input
          type='text'
          placeholder='Coupon code'
          className='cart-coupon-input'
        />
        <button type='button' className='cart-coupon-btn'>
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
  const isEmpty = cartItems.length === 0;

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

  return (
    <div className='cart-page'>
      {isEmpty ? (
        <div className='cart-empty'>
          <ShoppingBag className='cart-empty-icon' size={80} />
          <h1 className='cart-empty-title'>Your cart is empty</h1>
          <Link href='/collections' className='home-cta-primary'>
            Start Shopping
          </Link>
          <div className='cart-recommended'>
            <h2 className='home-section-title'>Recommended</h2>
            <div className='home-products-grid'>
              {products.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className='home-product-card'
                >
                  <div className='home-product-image' />
                  <div className='home-product-info'>
                    <h3 className='home-product-name'>{p.name}</h3>
                    <p className='home-product-price'>₺{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className='cart-title'>Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
          <div className='cart-layout'>
            <div className='cart-items'>
              {cartItems.map((item) => (
                <div key={item.id} className='cart-item'>
                  <div
                    className='cart-item-thumb'
                    style={{
                      width: 100,
                      height: 100,
                      background: item.product.images?.[0]?.url 
                        ? `url(${item.product.images[0].url}) center/cover` 
                        : 'rgba(26,10,31,0.8)',
                      border: '2px solid rgba(139,115,85,0.3)',
                    }}
                  />
                  <div className='cart-item-details'>
                    <h3 className='cart-item-name'>{item.product.name}</h3>
                    <p className='cart-item-meta'>
                      {item.product.productType && item.product.theme 
                        ? `${item.product.productType} · ${item.product.theme}`
                        : item.product.productType || item.product.theme || 'Product'
                      }
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
              <div className='cart-summary-standalone cart-summary'>
                <CartSummaryContent total={total} />
              </div>
              <details className='cart-summary-collapse' open>
                <summary>
                  Order Summary — ₺{total.toFixed(2)}
                </summary>
                <div className='cart-summary'>
                  <CartSummaryContent total={total} />
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
