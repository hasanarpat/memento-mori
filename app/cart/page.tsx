"use client";

import Link from "next/link";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import { useCart } from "../components/ShopLayout";
import { products } from "../data/shop";

function CartSummaryContent({ total }: { total: number }) {
  return (
    <>
      <h2 className="cart-summary-title">Order Summary</h2>
      <div className="cart-summary-row">
        <span>Subtotal</span>
        <span>₺{total}</span>
      </div>
      <div className="cart-summary-row">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="cart-summary-row">
        <span>Tax</span>
        <span>—</span>
      </div>
      <div className="cart-summary-row cart-summary-total">
        <span>Total</span>
        <span>₺{total}</span>
      </div>
      <div className="cart-coupon">
        <input
          type="text"
          placeholder="Coupon code"
          className="cart-coupon-input"
        />
        <button type="button" className="cart-coupon-btn">
          Apply
        </button>
      </div>
      <Link href="/checkout" className="cart-checkout-btn">
        Proceed to Checkout
      </Link>
      <Link href="/collections" className="cart-continue-link">
        Continue Shopping
      </Link>
    </>
  );
}

// Demo: use a simple cart store or context with items. For now we only have count in context.
// This page shows empty state when count is 0, or a demo filled state.
export default function CartPage() {
  const { cartCount } = useCart();
  const isEmpty = cartCount === 0;

  // Demo items for filled state (first 2 products)
  const demoItems = products.slice(0, 2).map((p, i) => ({
    ...p,
    qty: i + 1,
    size: "M",
    color: "Black",
  }));

  return (
    <div className="cart-page">
      {isEmpty ? (
        <div className="cart-empty">
          <ShoppingBag className="cart-empty-icon" size={80} />
          <h1 className="cart-empty-title">Your cart is empty</h1>
          <Link href="/collections" className="home-cta-primary">
            Start Shopping
          </Link>
          <div className="cart-recommended">
            <h2 className="home-section-title">Recommended</h2>
            <div className="home-products-grid">
              {products.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="home-product-card"
                >
                  <div className="home-product-image" />
                  <div className="home-product-info">
                    <h3 className="home-product-name">{p.name}</h3>
                    <p className="home-product-price">₺{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-layout">
            <div className="cart-items">
              {demoItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div
                    className="cart-item-thumb"
                    style={{
                      width: 100,
                      height: 100,
                      background: "rgba(26,10,31,0.8)",
                      border: "2px solid rgba(139,115,85,0.3)",
                    }}
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-meta">
                      {item.category} · {item.size} · {item.color}
                    </p>
                    <div className="cart-item-qty">
                      <button type="button" aria-label="Decrease">
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="Increase">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-prices">
                    <span className="cart-item-unit">₺{item.price}</span>
                    <span className="cart-item-total">
                      ₺{item.price * item.qty}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    aria-label="Remove item"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
            <aside className="cart-sidebar">
              <div className="cart-summary-standalone cart-summary">
                <CartSummaryContent
                  total={demoItems.reduce((s, i) => s + i.price * i.qty, 0)}
                />
              </div>
              <details className="cart-summary-collapse" open>
                <summary>Order Summary — ₺{demoItems.reduce((s, i) => s + i.price * i.qty, 0)}</summary>
                <div className="cart-summary">
                  <CartSummaryContent
                    total={demoItems.reduce((s, i) => s + i.price * i.qty, 0)}
                  />
                </div>
              </details>
            </aside>
          </div>
          <div className="cart-trust">
            <span>Secure payment</span>
            <span>Free returns</span>
            <span>24/7 support</span>
          </div>
        </>
      )}
    </div>
  );
}
