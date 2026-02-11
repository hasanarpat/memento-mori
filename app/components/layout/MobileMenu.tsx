
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Search,
  ChevronDown,
  ArrowRight,
  User,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useAppDispatch } from '../../lib/redux/hooks';
import { logout } from '../../lib/redux/slices/authSlice';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
  isAuthenticated: boolean;
  wishlistCount: number;
  cartCount: number;
}

export default function MobileMenu({
  isOpen,
  onClose,
  onSearchOpen,
  isAuthenticated,
  wishlistCount,
  cartCount,
}: MobileMenuProps) {
  const dispatch = useAppDispatch();
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileCodexOpen, setMobileCodexOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('memento-wishlist');
    localStorage.removeItem('memento-cart');
    onClose();
  };

  return (
    <>
      <div
        className={`mobile-menu-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <div className={`mobile-menu-drawer ${isOpen ? 'open' : ''}`}>
        <div className='mobile-menu-header'>
          <span className='mobile-menu-title'>
            <span className='mobile-menu-title-symbol'>☠</span>
            MEMENTO
          </span>
          <button
            type='button'
            className='mobile-menu-close'
            onClick={onClose}
            aria-label='Close menu'
          >
            <X size={22} />
          </button>
        </div>

        <div className='mobile-menu-search-container'>
          <div
            className='mobile-menu-search-box'
            onClick={() => {
              onClose();
              onSearchOpen();
            }}
          >
            <Search size={18} />
            <span>Seek products...</span>
          </div>
        </div>

        <div className='mobile-menu-scroll-area'>
          <nav className='mobile-menu-nav'>
            <Link
              href='/'
              className='mobile-menu-link'
              onClick={onClose}
            >
              HOME
            </Link>

            {/* MOBILE SHOP ACCORDION */}
            <div className='mobile-menu-accordion'>
              <button
                className={`mobile-menu-accordion-trigger ${mobileShopOpen ? 'open' : ''}`}
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
              >
                SHOP <ChevronDown size={16} />
              </button>
              <div
                className={`mobile-menu-accordion-content ${mobileShopOpen ? 'open' : ''}`}
              >
                <Link
                  href='/collections'
                  onClick={onClose}
                >
                  Collections <ArrowRight size={14} />
                </Link>
                <Link
                  href='/new-arrivals'
                  onClick={onClose}
                >
                  New Arrivals <ArrowRight size={14} />
                </Link>
                <Link href='/ritual' onClick={onClose}>
                  Ritual & Altar <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* MOBILE EXPLORE ACCORDION */}
            <div className='mobile-menu-accordion'>
              <button
                className={`mobile-menu-accordion-trigger ${mobileExploreOpen ? 'open' : ''}`}
                onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
              >
                EXPLORE <ChevronDown size={16} />
              </button>
              <div
                className={`mobile-menu-accordion-content ${mobileExploreOpen ? 'open' : ''}`}
              >
                <Link
                  href='/journal'
                  onClick={onClose}
                >
                  Journal <ArrowRight size={14} />
                </Link>
                <Link href='/about' onClick={onClose}>
                  About <ArrowRight size={14} />
                </Link>
                <Link
                  href='/lookbook'
                  onClick={onClose}
                >
                  Lookbook <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* MOBILE CODEX ACCORDION */}
            <div className='mobile-menu-accordion'>
              <button
                className={`mobile-menu-accordion-trigger ${mobileCodexOpen ? 'open' : ''}`}
                onClick={() => setMobileCodexOpen(!mobileCodexOpen)}
              >
                CODEX <ChevronDown size={16} />
              </button>
              <div
                className={`mobile-menu-accordion-content ${mobileCodexOpen ? 'open' : ''}`}
              >
                <Link
                  href='/size-guide'
                  onClick={onClose}
                >
                  Sizing <ArrowRight size={14} />
                </Link>
                <Link href='/kvkk' onClick={onClose}>
                  KVKK <ArrowRight size={14} />
                </Link>
                <Link
                  href='/gizlilik-politikasi'
                  onClick={onClose}
                >
                  Privacy <ArrowRight size={14} />
                </Link>
                <Link
                  href='/contact'
                  onClick={onClose}
                >
                  Contact <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className='mobile-menu-footer'>
          <div className='mobile-menu-quick-grid'>
            {isAuthenticated ? (
              <>
                <Link
                  href='/account'
                  className='mobile-quick-action'
                  onClick={onClose}
                >
                  <User size={20} />
                  <span>ACCOUNT</span>
                </Link>
                <button
                   type="button"
                   className='mobile-quick-action'
                   onClick={handleLogout}
                >
                   <span>LOGOUT</span>
                </button>
              </>
            ) : (
              <Link
                href='/login'
                className='mobile-quick-action'
                onClick={onClose}
              >
                <User size={20} />
                <span>LOGIN</span>
              </Link>
            )}
            <Link
              href='/wishlist'
              className='mobile-quick-action'
              onClick={onClose}
            >
              <div className='action-icon-wrap'>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className='action-badge'>
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span>WISHES</span>
            </Link>
            <Link
              href='/cart'
              className='mobile-quick-action action-accent'
              onClick={onClose}
            >
              <div className='action-icon-wrap'>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className='action-badge'>{cartCount}</span>
                )}
              </div>
              <span>CART</span>
            </Link>
          </div>
          <div className='mobile-menu-bottom-tag'>
            <p>Est. MMXXVI</p>
            <div className='mobile-menu-divider-dots'>•••</div>
          </div>
        </div>
      </div>
    </>
  );
}
