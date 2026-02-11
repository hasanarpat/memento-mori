'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchModal from '@/app/components/SearchModal';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import { modifyWishlist } from '../lib/redux/slices/wishlistSlice';
import { addToCart } from '../lib/redux/slices/cartSlice';

// Components
import Header from './layout/Header';
import Footer from './layout/Footer';
import MobileMenu from './layout/MobileMenu';
import AuthSync from './providers/AuthSync';

// Hooks for Context (Backward Comp)
export function useCart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addItem = (item: any) => {
     if (!item) {
        console.error("addToCart now requires an item object");
        return;
     }
     dispatch(addToCart(item));
  };

  return { cartCount, addToCart: addItem };
}

export function useWishlist() {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.wishlistIds);

  const toggle = (id: string | number) => dispatch(modifyWishlist(String(id)));
  const isIn = (id: string | number) => wishlistIds.includes(String(id));

  return { wishlistIds, toggleWishlist: toggle, isInWishlist: isIn };
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Mobile & Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Data from Redux for Header
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistIds = useAppSelector((state) => state.wishlist.wishlistIds);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const hideFooter = pathname === '/login';

  return (
        <div className='dark-cult-shop'>
          <AuthSync />
          
          <div className='grain-overlay' />
          <div className='web-decoration' />
          <div className='web-decoration web-decoration-left' />

          <Header 
            cartCount={cartCount}
            wishlistCount={wishlistIds.length}
            isAuthenticated={isAuthenticated}
            user={user}
            onMobileMenuOpen={() => setMobileOpen(true)}
            mobileMenuOpen={mobileOpen}
            onSearchOpen={() => setSearchOpen(true)}
          />

          <MobileMenu 
            isOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
            onSearchOpen={() => setSearchOpen(true)}
            isAuthenticated={isAuthenticated}
            cartCount={cartCount}
            wishlistCount={wishlistIds.length}
          />

          <SearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />

          <div className='page-container'>{children}</div>

          {!hideFooter && <Footer />}
        </div>
  );
}
