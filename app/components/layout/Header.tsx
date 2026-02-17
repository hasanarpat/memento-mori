'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  Heart,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAppDispatch } from '../../lib/redux/hooks';
import { logout } from '../../lib/redux/slices/authSlice';
import { SITE_NAME } from '../../lib/site';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  user: { name?: string; email?: string } | null;
  onMobileMenuOpen: () => void;
  mobileMenuOpen: boolean;
  onSearchOpen: () => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  isAuthenticated,
  user,
  onMobileMenuOpen,
  mobileMenuOpen,
  onSearchOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [shopOpen, setShopOpen] = useState(false); // Changed default to closed
  const [exploreOpen, setExploreOpen] = useState(false);
  const [codexOpen, setCodexOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const shopRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const codexRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('memento-wishlist');
    localStorage.removeItem('memento-cart');
    setUserOpen(false);
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (codexRef.current && !codexRef.current.contains(e.target as Node)) {
        setCodexOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
      if (
        exploreRef.current &&
        !exploreRef.current.contains(e.target as Node)
      ) {
        setExploreOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <header className='header'>
      <div className='header-content'>
        <Link href='/' className='logo'>
          MEMENTO MORI
        </Link>
        <nav className='nav'>
          <Link
            href='/'
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            HOME
          </Link>

          {/* SHOP DROPDOWN */}
          <div className='nav-dropdown-wrapper' ref={shopRef}>
            <button
              type='button'
              className={`nav-link nav-link-button ${shopOpen ? 'active' : ''}`}
              aria-expanded={shopOpen}
              onClick={() => setShopOpen((open) => !open)}
            >
              SHOP
            </button>
            <div className='nav-dropdown-content'>
              <Link
                href='/collections'
                onClick={() => setShopOpen(false)}
              >
                Collections
              </Link>
              <Link
                href='/new-arrivals'
                onClick={() => setShopOpen(false)}
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* EXPLORE DROPDOWN */}
          <div className='nav-dropdown-wrapper' ref={exploreRef}>
            <button
              type='button'
              className={`nav-link nav-link-button ${exploreOpen ? 'active' : ''}`}
              aria-expanded={exploreOpen}
              onClick={() => setExploreOpen((open) => !open)}
            >
              EXPLORE
            </button>
            <div className='nav-dropdown-content'>
              <Link href='/journal' onClick={() => setExploreOpen(false)}>
                Journal
              </Link>
              <Link href='/about' onClick={() => setExploreOpen(false)}>
                About
              </Link>
            </div>
          </div>

          {/* CODEX DROPDOWN */}
          <div className='nav-dropdown-wrapper' ref={codexRef}>
            <button
              type='button'
              className={`nav-link nav-link-button ${codexOpen ? 'active' : ''}`}
              aria-expanded={codexOpen}
              onClick={() => setCodexOpen((open) => !open)}
            >
              CODEX
            </button>
            <div className='nav-dropdown-content'>
              <Link
                href='/size-guide'
                onClick={() => setCodexOpen(false)}
              >
                Sizing
              </Link>
              <Link href='/kvkk' onClick={() => setCodexOpen(false)}>
                KVKK
              </Link>
              <Link
                href='/gizlilik-politikasi'
                onClick={() => setCodexOpen(false)}
              >
                Gizlilik
              </Link>
              <Link href='/contact' onClick={() => setCodexOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        </nav>
        <div className='header-actions'>
          <button
            type='button'
            className='search-trigger'
            onClick={onSearchOpen}
            aria-label='Search'
          >
            <Search size={18} />
            <span className='search-trigger-text'>seek...</span>
          </button>
          <Link
            href='/wishlist'
            className='icon-button'
            aria-label='Wishlist'
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className='cart-badge'>{wishlistCount}</span>
            )}
          </Link>
          <Link href='/cart' className='icon-button' aria-label='Cart'>
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className='cart-badge'>{cartCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className='nav-dropdown-wrapper' ref={userRef}>
              <button
                type='button'
                className={`icon-button ${userOpen ? 'active' : ''}`}
                aria-expanded={userOpen}
                onClick={() => setUserOpen((open) => !open)}
                aria-label="Account menu"
              >
                <User size={20} />
              </button>
              <div className='nav-dropdown-content dropdown-right user-dropdown'>
                <div className='user-dropdown-header'>
                  <div className='user-dropdown-avatar'>
                    <User size={18} />
                  </div>
                  <div className='user-dropdown-info'>
                    <span className='user-dropdown-name'>
                      {userName}
                    </span>
                    <span className='user-dropdown-email'>
                      {userEmail}
                    </span>
                  </div>
                </div>
                <div className='user-dropdown-divider' />
                <Link href='/account' onClick={() => setUserOpen(false)} className='user-dropdown-link'>
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <Link href='/account/orders' onClick={() => setUserOpen(false)} className='user-dropdown-link'>
                  <ShoppingCart size={16} />
                  <span>Orders</span>
                </Link>
                <Link href='/account/wishlist' onClick={() => setUserOpen(false)} className='user-dropdown-link'>
                  <Heart size={16} />
                  <span>Wishlist</span>
                </Link>
                <div className='user-dropdown-divider' />
                <button
                  type="button"
                  className="user-dropdown-link user-dropdown-logout"
                  onClick={handleLogout}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <Link href={pathname === '/login' ? '/login' : `/login?return=${encodeURIComponent(pathname)}`} className='nav-link header-login'>
              LOGIN
            </Link>
          )}
          <button
            type='button'
            className='mobile-menu-btn'
            onClick={onMobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
