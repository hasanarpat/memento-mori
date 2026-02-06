'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);

  const savedAddresses = [
    {
      id: 1,
      name: 'Home',
      city: 'Istanbul',
      address: 'Beyoğlu, Galata Tower District',
    },
    { id: 2, name: 'Office', city: 'Ankara', address: 'Çankaya, Tunalı Hilmi' },
  ];

  const savedCards = [
    { id: 1, brand: 'Visa', last4: '4242', expiry: '12/26' },
    { id: 2, brand: 'Mastercard', last4: '8888', expiry: '09/25' },
  ];

  return (
    <div className='checkout-page'>
      <div className='checkout-progress'>
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`checkout-step ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'done' : ''}`}
          >
            {i + 1 < step ? <Check size={18} /> : <span>{i + 1}</span>}
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className='checkout-layout'>
        <main className='checkout-main'>
          {step === 1 && (
            <section className='checkout-section'>
              <h2>Shipping Information</h2>

              {!isAddingNewAddress && savedAddresses.length > 0 && (
                <div className='saved-items-container'>
                  <h3 className='saved-items-title'>Select a Saved Address</h3>
                  <div className='saved-items-grid'>
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`saved-item-card ${selectedAddress === addr.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedAddress(addr.id);
                          setIsAddingNewAddress(false);
                        }}
                      >
                        <div className='saved-item-header'>
                          <strong>{addr.name}</strong>
                          {selectedAddress === addr.id && <Check size={14} />}
                        </div>
                        <p>{addr.address}</p>
                        <p>{addr.city}</p>
                      </div>
                    ))}
                    <button
                      className='add-new-item-btn'
                      onClick={() => {
                        setSelectedAddress(null);
                        setIsAddingNewAddress(true);
                      }}
                    >
                      + New Address
                    </button>
                  </div>
                </div>
              )}

              {(isAddingNewAddress || savedAddresses.length === 0) && (
                <form className='checkout-form'>
                  <div className='form-header-row'>
                    <h3>New Shipping Address</h3>
                    {savedAddresses.length > 0 && (
                      <button
                        type='button'
                        className='text-btn'
                        onClick={() => setIsAddingNewAddress(false)}
                      >
                        Use saved address
                      </button>
                    )}
                  </div>
                  <label>
                    Full Name <input type='text' required />
                  </label>
                  <label>
                    Email <input type='email' required />
                  </label>
                  <div className='checkout-form-row'>
                    <label>
                      City <input type='text' required />
                    </label>
                    <label>
                      Postal Code <input type='text' required />
                    </label>
                  </div>
                  <label>
                    Address <input type='text' required />
                  </label>
                  <label className='checkout-checkbox'>
                    <input type='checkbox' defaultChecked /> Save this address
                    to my account
                  </label>
                </form>
              )}

              {/* Progression button moved to sidebar */}
            </section>
          )}

          {step === 2 && (
            <section className='checkout-section'>
              <h2>Payment Method</h2>

              {!isAddingNewCard && savedCards.length > 0 && (
                <div className='saved-items-container'>
                  <h3 className='saved-items-title'>Select a Saved Card</h3>
                  <div className='saved-items-grid'>
                    {savedCards.map((card) => (
                      <div
                        key={card.id}
                        className={`saved-item-card ${selectedCard === card.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCard(card.id);
                          setIsAddingNewCard(false);
                        }}
                      >
                        <div className='saved-item-header'>
                          <strong>
                            {card.brand} **** {card.last4}
                          </strong>
                          {selectedCard === card.id && <Check size={14} />}
                        </div>
                        <p>Expires: {card.expiry}</p>
                      </div>
                    ))}
                    <button
                      className='add-new-item-btn'
                      onClick={() => {
                        setSelectedCard(null);
                        setIsAddingNewCard(true);
                      }}
                    >
                      + New Card
                    </button>
                  </div>
                </div>
              )}

              {(isAddingNewCard || savedCards.length === 0) && (
                <div className='checkout-card-form'>
                  <div className='form-header-row'>
                    <h3>New Credit Card</h3>
                    {savedCards.length > 0 && (
                      <button
                        type='button'
                        className='text-btn'
                        onClick={() => setIsAddingNewCard(false)}
                      >
                        Use saved card
                      </button>
                    )}
                  </div>
                  <label>
                    Card number{' '}
                    <input type='text' placeholder='1234 5678 9012 3456' />
                  </label>
                  <label>
                    Cardholder name <input type='text' />
                  </label>
                  <div className='checkout-form-row'>
                    <label>
                      Expiry (MM/YY) <input type='text' placeholder='MM/YY' />
                    </label>
                    <label>
                      CVV <input type='text' placeholder='123' />
                    </label>
                  </div>
                  <label className='checkout-checkbox'>
                    <input type='checkbox' defaultChecked /> Save card for
                    future rituals
                  </label>
                </div>
              )}

              <div className='checkout-payment-bottom'>
                <p className='checkout-secure'>
                  🔒 SSL secured · Secure encrypted payment
                </p>
              </div>
            </section>
          )}
          {step === 3 && (
            <section className='checkout-section'>
              <h2>Order Review</h2>
              <div className='checkout-review-content'>
                {/* Order Items Summary */}
                <div className='review-items-list'>
                  <div className='review-item'>
                    <div className='review-item-img-placeholder'>🖼️</div>
                    <div className='review-item-info'>
                      <h4>Midnight Velvet Cloak</h4>
                      <p>Size: Large · Color: Obsidian</p>
                      <div className='review-item-price-row'>
                        <span>1 × ₺840</span>
                        <strong>₺840</strong>
                      </div>
                    </div>
                  </div>
                  <div className='review-item'>
                    <div className='review-item-img-placeholder'>🖼️</div>
                    <div className='review-item-info'>
                      <h4>Silver Raven Signet</h4>
                      <p>Material: Sterling Silver</p>
                      <div className='review-item-price-row'>
                        <span>1 × ₺488</span>
                        <strong>₺488</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment Summary Recap */}
                <div className='review-summary-recap'>
                  <div className='recap-box'>
                    <div className='recap-header'>
                      <h4>Shipping to</h4>
                      <button onClick={() => setStep(1)} className='text-btn'>
                        Edit
                      </button>
                    </div>
                    <p>Beyoğlu, Galata Tower District, Istanbul</p>
                  </div>
                  <div className='recap-box'>
                    <div className='recap-header'>
                      <h4>Payment method</h4>
                      <button onClick={() => setStep(2)} className='text-btn'>
                        Edit
                      </button>
                    </div>
                    <p>Visa ending in 4242</p>
                  </div>
                </div>

                {/* Legal Agreements */}
                <div className='legal-agreements'>
                  <label className='memento-checkbox-label'>
                    <input
                      type='checkbox'
                      className='memento-checkbox-input'
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className='memento-checkbox-custom'></span>
                    <span className='memento-checkbox-text'>
                      Mesafeli Satış Sözleşmesi&apos;ni okudum ve kabul
                      ediyorum.
                    </span>
                  </label>
                  <label className='memento-checkbox-label'>
                    <input type='checkbox' className='memento-checkbox-input' />
                    <span className='memento-checkbox-custom'></span>
                    <span className='memento-checkbox-text'>
                      Ön Bilgilendirme Koşulları&apos;nı okudum ve onaylıyorum.
                    </span>
                  </label>
                  <label className='memento-checkbox-label'>
                    <input
                      type='checkbox'
                      className='memento-checkbox-input'
                      defaultChecked
                    />
                    <span className='memento-checkbox-custom'></span>
                    <span className='memento-checkbox-text'>
                      Kişisel verilerimin işlenmesine ilişkin Aydınlatma
                      Metni&apos;ni okudum.
                    </span>
                  </label>
                </div>

                {/* Progression button moved to sidebar */}
              </div>
            </section>
          )}
        </main>
        <aside className='checkout-sidebar'>
          <div className='cart-summary'>
            <h2 className='cart-summary-title'>Order Summary</h2>
            <div className='cart-summary-row'>
              <span>Subtotal</span>
              <span>₺1,328</span>
            </div>
            <div className='cart-summary-row cart-summary-total'>
              <span>Total</span>
              <span>₺1,328</span>
            </div>

            {/* Sticky/Sidebar Progression Buttons */}
            <div className='checkout-sidebar-actions'>
              {step === 1 && (
                <button
                  type='button'
                  className='checkout-primary-btn'
                  disabled={!selectedAddress && !isAddingNewAddress}
                  onClick={() => setStep(2)}
                >
                  Continue to Payment
                </button>
              )}
              {step === 2 && (
                <button
                  type='button'
                  className='checkout-primary-btn'
                  disabled={!selectedCard && !isAddingNewCard}
                  onClick={() => setStep(3)}
                >
                  Review Order
                </button>
              )}
              {step === 3 && (
                <button
                  type='button'
                  className='checkout-primary-btn confirm-order-btn'
                  disabled={!agreeTerms}
                >
                  Confirm & Finalize Ritual
                </button>
              )}
              <p className='checkout-sidebar-note'>
                {step < 3
                  ? 'Tax and shipping calculated at checkout.'
                  : 'By confirming, you agree to our terms of ritual.'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
