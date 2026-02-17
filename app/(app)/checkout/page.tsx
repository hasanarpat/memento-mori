'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, CreditCard, Plus } from 'lucide-react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import { clearCart } from '../../lib/redux/slices/cartSlice';
import Modal from '../../components/Modal';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const coupon = useAppSelector((state) => state.cart.coupon);
  const user = useAppSelector((state) => state.auth.user);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon?.discountAmount ?? 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const [step, setStep] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const cardsDropdownRef = useRef<HTMLDivElement>(null);
  const [cardsDropdownOpen, setCardsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardsDropdownRef.current && !cardsDropdownRef.current.contains(e.target as Node)) {
        setCardsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCardData = selectedCard != null ? savedCards.find((c) => c.id === selectedCard) : null;

  const handlePlaceOrder = async () => {
    if (!agreeTerms) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Construct Shipping Address (Mock data if using existing ID, or form data if new)
      // For this demo, we'll just use a mock address since we selected an ID.
      // In a real app, you'd pull the full address object based on selectedAddress ID.
      const shippingAddress = {
        fullName: 'Test User',
        addressLine1: 'Galata Tower District',
        city: 'Istanbul',
        postalCode: '34421',
        country: 'Turkey',
      };

      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress,
          paymentMethod: 'credit_card',
          user: user?.id
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Success
      setCreatedOrderId(data.orderId);
      dispatch(clearCart());
      setShowSuccessModal(true);

    } catch (err: any) {
      console.error('Order placement failed', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='checkout-page'>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => router.push('/account/orders')}
        title="Siparişiniz Alındı"
      >
        <div className="text-center">
          <p className="mb-4 text-aged-silver">
            Siparişiniz başarıyla oluşturuldu. Ritüeliniz hazırlanıyor.
          </p>
          {createdOrderId && (
            <p className="mb-6 font-cinzel text-bone">
              Sipariş No: #{createdOrderId}
            </p>
          )}
          <button
            onClick={() => router.push('/account/orders')}
            className="w-full py-3 bg-blood-red text-bone font-cinzel hover:bg-accent transition-colors"
          >
            Siparişlerim'e Git
          </button>
        </div>
      </Modal>
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
                <div className='checkout-cards-dropdown-wrap' ref={cardsDropdownRef}>
                  <h3 className='saved-items-title'>Payment method</h3>
                  <button
                    type='button'
                    className='checkout-cards-trigger'
                    onClick={() => setCardsDropdownOpen((o) => !o)}
                    aria-expanded={cardsDropdownOpen}
                    aria-haspopup='listbox'
                    aria-label={selectedCardData ? `${selectedCardData.brand} ending ${selectedCardData.last4}` : 'Select a saved card'}
                  >
                    <CreditCard size={20} className='checkout-cards-trigger-icon' />
                    {selectedCardData ? (
                      <span className='checkout-cards-trigger-detail'>
                        <span className='checkout-cards-trigger-brand'>{selectedCardData.brand}</span>
                        <span className='checkout-cards-trigger-meta'>
                          **** {selectedCardData.last4} · Expires {selectedCardData.expiry}
                        </span>
                      </span>
                    ) : (
                      <span className='checkout-cards-trigger-placeholder'>Select a saved card</span>
                    )}
                    <ChevronDown size={18} className={`checkout-cards-trigger-chevron ${cardsDropdownOpen ? 'open' : ''}`} />
                  </button>
                  {cardsDropdownOpen && (
                    <div className='checkout-cards-dropdown-list' role='listbox'>
                      {savedCards.map((card) => (
                        <button
                          key={card.id}
                          type='button'
                          role='option'
                          aria-selected={selectedCard === card.id}
                          className={`checkout-cards-dropdown-item ${selectedCard === card.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedCard(card.id);
                            setCardsDropdownOpen(false);
                          }}
                        >
                          <span className='checkout-cards-item-brand'>{card.brand}</span>
                          <span className='checkout-cards-item-number'>**** {card.last4}</span>
                          <span className='checkout-cards-item-expiry'>Exp {card.expiry}</span>
                          {selectedCard === card.id && <Check size={16} className='checkout-cards-item-check' />}
                        </button>
                      ))}
                      <button
                        type='button'
                        className='checkout-cards-dropdown-new'
                        onClick={() => {
                          setSelectedCard(null);
                          setIsAddingNewCard(true);
                          setCardsDropdownOpen(false);
                        }}
                      >
                        <Plus size={18} />
                        Add new card
                      </button>
                    </div>
                  )}
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
                  {cartItems.map((item) => {
                    const imageUrl =
                      item.product.images &&
                        typeof item.product.images === 'object' &&
                        'url' in item.product.images
                        ? (item.product.images as { url?: string }).url
                        : undefined;

                    return (
                      <div key={item.id} className='review-item'>
                        <div className='review-item-img-placeholder'>
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={item.product.name}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            '🖼️'
                          )}
                        </div>
                        <div className='review-item-info'>
                          <h4>{item.product.name}</h4>
                          <p>
                            {/* Display variant info if available, otherwise just quantity */}
                            Qty: {item.quantity}
                            {item.product.theme ? ` · ${item.product.theme}` : ''}
                          </p>
                          <div className='review-item-price-row'>
                            <span>
                              {item.quantity} × ₺{item.price.toFixed(2)}
                            </span>
                            <strong>₺{(item.price * item.quantity).toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
            {/* Mini Cart Items (Visible on all steps) */}
            <div className='checkout-mini-cart mb-6 border-b border-white/10 pb-6'>
              <h3 className='text-bone font-cinzel text-lg mb-4'>In Your Cart</h3>
              <div className='flex flex-col gap-3'>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex gap-3 items-start'>
                    <div className='relative w-12 h-12 bg-white/5 border border-white/10 rounded overflow-hidden flex-shrink-0'>
                      {(item.product.images as { url?: string })?.url ? (
                        <Image
                          src={(item.product.images as { url?: string }).url!}
                          alt={item.product.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex items-center justify-center w-full h-full text-xs'>🖼️</div>
                      )}
                      <span className='absolute -top-1 -right-1 bg-blood-red text-bone text-[10px] w-4 h-4 flex items-center justify-center rounded-full'>
                        {item.quantity}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-bone text-sm font-crimson truncate'>{item.product.name}</p>
                      <p className='text-aged-silver text-xs'>₺{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h2 className='cart-summary-title'>Order Summary</h2>
            <div className='cart-summary-row'>
              <span>Subtotal</span>
              <span>₺{cartTotal.toFixed(2)}</span>
            </div>
            {coupon && (
              <div className='cart-summary-row cart-summary-discount'>
                <span>Coupon ({coupon.code})</span>
                <span className='discount-amount'>-₺{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className='cart-summary-row'>
              <span>Shipping</span>
              <span>Calculated next step</span>
            </div>
            <div className='cart-summary-row cart-summary-total'>
              <span>Total</span>
              <span>₺{finalTotal.toFixed(2)}</span>
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
                <>
                  {errorMsg && (
                    <div className="mb-4 p-3 border border-red-900 bg-red-900/20 text-red-200 text-sm">
                      {errorMsg}
                    </div>
                  )}
                  <button
                    type='button'
                    className='checkout-primary-btn confirm-order-btn'
                    disabled={!agreeTerms || isProcessing}
                    onClick={handlePlaceOrder}
                  >
                    {isProcessing ? 'İşleniyor...' : 'Siparişi Onayla'}
                  </button>
                </>
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
