"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const STEPS = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="checkout-page">
      <div className="checkout-progress">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`checkout-step ${i + 1 === step ? "active" : ""} ${i + 1 < step ? "done" : ""}`}
          >
            {i + 1 < step ? <Check size={18} /> : <span>{i + 1}</span>}
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <main className="checkout-main">
          {step === 1 && (
            <section className="checkout-section" aria-labelledby="shipping-heading">
              <h2 id="shipping-heading">Shipping Information</h2>
              <form className="checkout-form">
                <label>
                  Full Name <input type="text" required />
                </label>
                <label>
                  Email <input type="email" required />
                </label>
                <label>
                  Phone <input type="tel" />
                </label>
                <label>
                  Address Line 1 <input type="text" required />
                </label>
                <label>
                  Address Line 2 <input type="text" />
                </label>
                <div className="checkout-form-row">
                  <label>
                    City <input type="text" required />
                  </label>
                  <label>
                    State/Province <input type="text" />
                  </label>
                  <label>
                    Postal Code <input type="text" required />
                  </label>
                </div>
                <label>
                  Country
                  <select required>
                    <option value="">Select</option>
                    <option value="TR">Turkey</option>
                    <option value="US">United States</option>
                  </select>
                </label>
                <label className="checkout-checkbox">
                  <input type="checkbox" /> Save this address
                </label>
                <button
                  type="button"
                  className="home-cta-primary"
                  onClick={() => setStep(2)}
                >
                  Continue to Payment
                </button>
              </form>
            </section>
          )}
          {step === 2 && (
            <section className="checkout-section" aria-labelledby="payment-heading">
              <h2 id="payment-heading">Payment Method</h2>
              <div className="checkout-payment-options">
                <label className="checkout-radio">
                  <input type="radio" name="payment" defaultChecked />
                  Credit/Debit Card
                </label>
                <label className="checkout-radio">
                  <input type="radio" name="payment" />
                  PayPal
                </label>
                <label className="checkout-radio">
                  <input type="radio" name="payment" />
                  Bank Transfer
                </label>
              </div>
              <div className="checkout-card-form">
                <label>Card number <input type="text" placeholder="1234 5678 9012 3456" /></label>
                <label>Cardholder name <input type="text" /></label>
                <div className="checkout-form-row">
                  <label>Expiry (MM/YY) <input type="text" placeholder="MM/YY" /></label>
                  <label>CVV <input type="text" placeholder="123" /></label>
                </div>
              </div>
              <p className="checkout-secure">SSL secured · Secure payment</p>
              <button
                type="button"
                className="home-cta-primary"
                onClick={() => setStep(3)}
              >
                Place Order
              </button>
            </section>
          )}
          {step === 3 && (
            <section className="checkout-section" aria-labelledby="review-heading">
              <h2 id="review-heading">Order Review</h2>
              <div className="checkout-review">
                <p>Review your order details, shipping address, and payment method.</p>
                <p>
                  <Link href="#" className="product-detail-size-link">
                    Edit shipping
                  </Link>{" "}
                  ·{" "}
                  <Link href="#" className="product-detail-size-link">
                    Edit payment
                  </Link>
                </p>
                <label className="checkout-checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  I agree to the Terms & Conditions
                </label>
                <button
                  type="button"
                  className="home-cta-primary"
                  disabled={!agreeTerms}
                >
                  Confirm Order
                </button>
              </div>
            </section>
          )}
        </main>
        <aside className="checkout-sidebar">
          <div className="cart-summary">
            <h2 className="cart-summary-title">Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₺1,328</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>₺1,328</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
