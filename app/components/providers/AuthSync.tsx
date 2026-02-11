'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/redux/hooks';
import { checkAuth } from '../../lib/redux/slices/authSlice';
import { setWishlist, fetchWishlist, mergeWishlistWithBackend } from '../../lib/redux/slices/wishlistSlice';
import { fetchCart, syncCart, mergeCartWithBackend } from '../../lib/redux/slices/cartSlice';

const WISHLIST_KEY = 'memento-wishlist';
const CART_KEY = 'memento-cart';

export default function AuthSync() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistIds = useAppSelector((state) => state.wishlist.wishlistIds);
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 1. Check Authentication on Mount
    dispatch(checkAuth());
    
    // Guest: Sync from LocalStorage
    const syncLocal = () => {
      try {
        // Wishlist
        const rawWishlist = localStorage.getItem(WISHLIST_KEY);
        if (rawWishlist) {
          const parsed = JSON.parse(rawWishlist) as string[];
          if (Array.isArray(parsed)) dispatch(setWishlist(parsed));
        }
      } catch {
        // ignore
      }
    };
    if (!localStorage.getItem('payload-token')) {
        requestAnimationFrame(syncLocal);
    }
    
    // Listen for custom auth-change event from login page
    const handleAuthChange = () => {
      dispatch(checkAuth());
    };
    window.addEventListener('auth-change', handleAuthChange);
    
    // Sync cookie with localStorage token (Critical for Server Components)
    const token = localStorage.getItem('payload-token');
    if (token) {
       document.cookie = `payload-token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }

    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [dispatch]);

  // 2. Fetch Data or Merge when Authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      // CART MERGE
      // Try to get local cart from storage to cover refresh case
      let localCartItems: any[] = [...cartItems]; 
      try {
         const rawCart = localStorage.getItem(CART_KEY);
         if (rawCart) {
            const parsed = JSON.parse(rawCart);
            // Simple merge of lists if needed, or just use storage if state is empty
            if (localCartItems.length === 0 && Array.isArray(parsed)) {
               localCartItems = parsed;
            }
         }
      } catch {}

      if (localCartItems.length > 0) {
         dispatch(mergeCartWithBackend(localCartItems));
      } else {
         dispatch(fetchCart());
      }

      // WISHLIST MERGE
      let localWishlistIds: string[] = [...wishlistIds];
      try {
         const rawWishlist = localStorage.getItem(WISHLIST_KEY);
         if (rawWishlist) {
            const parsed = JSON.parse(rawWishlist);
            if (Array.isArray(parsed) && localWishlistIds.length === 0) {
               localWishlistIds = parsed;
            } else if (Array.isArray(parsed)) {
                // Combine unique
               localWishlistIds = Array.from(new Set([...localWishlistIds, ...parsed]));
            }
         }
      } catch {}

      if (localWishlistIds.length > 0) {
         dispatch(mergeWishlistWithBackend(localWishlistIds));
      } else {
         dispatch(fetchWishlist());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, dispatch]);

  // 3. Sync Data
  useEffect(() => {
    if (isAuthenticated && token) {
       // Auth: Cart Sync to Backend (Wishlist handled by thunk)
       if (cartItems.length > 0) {
          const timer = setTimeout(() => {
              dispatch(syncCart(cartItems));
          }, 2000);
          return () => clearTimeout(timer);
       }
    } else {
       // Guest: Sync to LocalStorage
       if (wishlistIds.length > 0) {
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
       }
       if (cartItems.length > 0) {
          localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
       }
    }
  }, [wishlistIds, cartItems, isAuthenticated, token, dispatch]);

  return null; // This component does not render anything
}
