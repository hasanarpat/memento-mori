'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Skull,
  Moon,
  Cog,
  Flame,
  Sparkles,
  BookOpen,
  Box,
  Zap,
  Droplets,
  X,
  ShoppingCart,
  Heart,
  Info,
} from 'lucide-react';
interface QuickViewProduct {
  id: string | number;
  slug?: string;
  name: string;
  price: number;
  theme: string;
  badge?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any;
  images?: { url?: string } | null;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: QuickViewProduct) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const themeIcons: Record<
  string,
  React.ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  gothic: Moon,
  steampunk: Cog,
  metal: Flame,
  occult: Sparkles,
  'dark-academia': BookOpen,
  industrial: Box,
  deathrock: Zap,
  ritual: Droplets,
};

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: QuickViewModalProps) {
  const [phase, setPhase] = useState<'hidden' | 'dealing' | 'open'>('hidden');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Onyx');

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Onyx', hex: '#0a0a0a' },
    { name: 'Slate', hex: '#2d2d2d' },
    { name: 'Crimson', hex: '#4a0a0a' },
  ];

  useEffect(() => {
    if (isOpen) {
      const dealTimer = setTimeout(() => setPhase('dealing'), 10);
      const openTimer = setTimeout(() => {
        setPhase('open');
      }, 710);
      return () => {
        clearTimeout(dealTimer);
        clearTimeout(openTimer);
      };
    } else {
      const hideTimer = setTimeout(() => setPhase('hidden'), 0);
      return () => clearTimeout(hideTimer);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(String(product.id));
  const Icon = themeIcons[product.theme] || Skull;

  return (
    <div
      className={`quickview-backdrop ${isOpen ? 'active' : ''}`}
      onClick={onClose}
    >
      <div
        className={`quickview-container phase-${phase}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* The Card Flip Entry Container */}
        <div className={`quickview-card-flip phase-${phase}`}>
          {/* Front Side (Card Back Style) */}
          <div className='quickview-card-side quickview-card-front'>
            <div className='memento-card-back'>
              <Skull size={80} strokeWidth={0.5} className='card-seal' />
              <div className='card-ornament top-left'></div>
              <div className='card-ornament top-right'></div>
              <div className='card-ornament bottom-left'></div>
              <div className='card-ornament bottom-right'></div>
              <div className='memento-branding'>MEMENTO MORI</div>
            </div>
          </div>

          {/* Back Side (Actual Content) */}
          <div className='quickview-card-side quickview-card-back'>
            <button className='quickview-close-btn' onClick={onClose}>
              <X size={24} />
            </button>

            <div className='quickview-layout'>
              {/* Product Image Section */}
              <div className='quickview-image-section'>
                <div className='quickview-image-placeholder'>
                  <Icon size={120} strokeWidth={0.5} />
                </div>
                {product.badge && (
                  <span
                    className={`quickview-badge ${product.badge.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info Section */}
              <div className='quickview-info-section'>
                <div className='quickview-header'>
                  <span className='qv-category'>
                    {Array.isArray(product.category)
                      ? (product.category as { title?: string }[]).map((c) => (typeof c === 'object' ? c.title : c)).join(' × ')
                      : (product.category as { title?: string } | null)?.title || (typeof product.category === 'string' ? product.category : product.theme)}
                  </span>
                  <h2 className='qv-title'>{product.name}</h2>
                  <div className='qv-price'>₺{product.price}</div>
                </div>

                <div className='qv-selectors'>
                  <div className='qv-selector-group'>
                    <label>Size</label>
                    <div className='qv-options'>
                      {sizes.map((s) => (
                        <button
                          key={s}
                          className={`qv-opt-btn ${selectedSize === s ? 'active' : ''}`}
                          onClick={() => setSelectedSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='qv-selector-group'>
                    <label>Color</label>
                    <div className='qv-options'>
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          className={`qv-color-btn ${selectedColor === c.name ? 'active' : ''}`}
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          style={
                            { '--color-hex': c.hex } as React.CSSProperties
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className='qv-actions'>
                  <button
                    className='qv-add-btn'
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button
                    className={`qv-wish-btn ${inWishlist ? 'active' : ''}`}
                    onClick={() => onToggleWishlist(String(product.id))}
                  >
                    <Heart
                      size={18}
                      fill={inWishlist ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <div className='qv-footer-links'>
                  <Link
                    href={`/product/${product.slug ?? product.id}`}
                    className='qv-detail-link'
                    onClick={onClose}
                  >
                    <Info size={14} />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
