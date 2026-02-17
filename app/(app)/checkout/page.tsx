'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, CreditCard, Plus, Package, Truck, Calendar } from 'lucide-react';
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
  const [lastOrder, setLastOrder] = useState<{
    items: typeof cartItems;
    total: number;
    shippingAddress: any;
    email?: string;
  } | null>(null);
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
      let shippingAddress;
      let guestEmail = null;

      if (selectedAddress) {
        // If using saved address (mock for now)
        shippingAddress = {
          fullName: 'Test User',
          addressLine1: 'Galata Tower District',
          city: 'Istanbul',
          postalCode: '34421',
          country: 'Turkey',
        };
      } else {
        // Gather from form (simple dom selection for this demo, ideally use state/react-hook-form)
        const form = document.querySelector('.checkout-form') as HTMLFormElement;
        if (!form && savedAddresses.length === 0) throw new Error("Shipping address required");

        if (form) {
          const formData = new FormData(form);
          shippingAddress = {
            fullName: formData.get('fullName') as string,
            addressLine1: formData.get('addressLine1') as string,
            city: formData.get('city') as string,
            postalCode: formData.get('postalCode') as string,
            country: 'Turkey', // Default
          };
          guestEmail = formData.get('email') as string;
        }
      }

      // If we still don't have address (shouldn't happen with validation)
      if (!shippingAddress) throw new Error("Please provide a shipping address");

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
          email: user?.email || guestEmail, // Send email if collected or logged in
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

      // Preserve order details for modal before clearing cart
      setLastOrder({
        items: [...cartItems],
        total: finalTotal,
        shippingAddress,
        email: guestEmail || user?.email,
      });

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
        title="Ritual Complete"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blood-red/20 flex items-center justify-center border border-blood-red/50">
              <Check size={32} className="text-blood-red" />
            </div>
          </div>

          <h2 className="text-2xl font-cinzel text-bone mb-2">Order Confirmed</h2>
          <p className="text-aged-silver mb-6 text-sm">
            Your offering has been accepted. We are preparing your ritual artifacts.
          </p>

          {createdOrderId && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                <span className="text-aged-silver text-sm">Order ID</span>
                <span className="font-mono text-bone">#{createdOrderId}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-bone">
                  <Calendar size={16} className="text-blood-red" />
                  <span>Estimated Delivery: <span className="text-aged-silver">5-7 Business Days</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-bone">
                  <Truck size={16} className="text-blood-red" />
                  <span>Standard Shipping</span>
                </div>
              </div>
            </div>
          )}

          {lastOrder && lastOrder.items.length > 0 && (
            <div className="mb-6 text-left">
              <h3 className="text-sm font-cinzel text-aged-silver mb-3 uppercase tracking-wider">Artifacts</h3>
              <div className="bg-black/40 rounded-lg border border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
                {lastOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0">
                    <div className="relative w-10 h-10 bg-white/5 rounded overflow-hidden flex-shrink-0">
                      {(item.product.images as { url?: string })?.url ? (
                        <Image
                          src={(item.product.images as { url?: string }).url!}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[10px]">🖼️</div>
                      )}
                      <span className="absolute bottom-0 right-0 bg-blood-red text-bone text-[8px] w-3 h-3 flex items-center justify-center rounded-tl">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-bone text-xs font-crimson truncate">{item.product.name}</p>
                    </div>
                    <span className="text-bone text-xs">₺{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 px-1">
                <span className="text-aged-silver text-sm">Total Paid</span>
                <span className="text-blood-red font-cinzel text-lg">₺{lastOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/account/orders')}
              className="w-full py-3 bg-blood-red text-bone font-cinzel hover:bg-accent transition-colors rounded-sm flex items-center justify-center gap-2"
            >
              <Package size={18} />
              View Your Order
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-transparent border border-white/20 text-aged-silver font-cinzel hover:bg-white/5 transition-colors rounded-sm"
            >
              Continue Rituals
            </button>
          </div>
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
                <form className='checkout-form' onSubmit={(e) => e.preventDefault()}>
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
                    Full Name <input
                      type='text'
                      required
                      name="fullName"
                    />
                  </label>

                  {/* Email field required for guests */}
                  <label>
                    Email Address (for order confirmation)
                    <input
                      type='email'
                      required={!user}
                      className={user ? 'opacity-50 cursor-not-allowed' : ''}
                      defaultValue={user?.email}
                      readOnly={!!user}
                      name="email"
                      placeholder="citizen@example.com"
                    />
                  </label>

                  <div className='checkout-form-row'>
                    <label>
                      City <input type='text' required name="city" />
                    </label>
                    <label>
                      Postal Code <input type='text' required name="postalCode" />
                    </label>
                  </div>
                  <label>
                    Address <input type='text' required name="addressLine1" />
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
