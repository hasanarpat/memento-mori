'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/redux/hooks';
import { checkAuth } from '../../lib/redux/slices/authSlice';
import { setWishlist, fetchWishlist, mergeWishlistWithBackend } from '../../lib/redux/slices/wishlistSlice';
import { fetchCart, syncCart, mergeCartWithBackend, setCartItems, type CartItem } from '../../lib/redux/slices/cartSlice';

const WISHLIST_KEY = 'memento-wishlist';
const CART_KEY = 'memento-cart';

export default function AuthSync() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartDirty = useAppSelector((state) => state.cart.dirty);
  const wishlistIds = useAppSelector((state) => state.wishlist.wishlistIds);
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const hasSyncedCartAndWishlistRef = useRef(false);

  useEffect(() => {
    // Guest: Sync from LocalStorage (wishlist + cart). Auth is already checked by StoreProvider.
    const syncLocal = () => {
      try {
        const rawWishlist = localStorage.getItem(WISHLIST_KEY);
        if (rawWishlist) {
          const parsed = JSON.parse(rawWishlist) as string[];
          if (Array.isArray(parsed)) dispatch(setWishlist(parsed));
        }
        const rawCart = localStorage.getItem(CART_KEY);
        if (rawCart) {
          const parsed = JSON.parse(rawCart);
          if (Array.isArray(parsed) && parsed.length > 0) dispatch(setCartItems(parsed as CartItem[]));
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

  // Reset sync ref on logout so next login runs fetch/merge again
  useEffect(() => {
    if (!isAuthenticated) hasSyncedCartAndWishlistRef.current = false;
  }, [isAuthenticated]);

  // 2. Fetch cart & wishlist once when authenticated (no duplicate runs)
  useEffect(() => {
    if (!isAuthenticated || !token || hasSyncedCartAndWishlistRef.current) return;
    hasSyncedCartAndWishlistRef.current = true;

    let localCartItems: CartItem[] = [...cartItems];
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      if (rawCart) {
        const parsed = JSON.parse(rawCart);
        if (localCartItems.length === 0 && Array.isArray(parsed)) localCartItems = parsed;
      }
    } catch {
      /* ignore */
    }

    if (localCartItems.length > 0) {
      dispatch(mergeCartWithBackend(localCartItems));
    } else {
      dispatch(fetchCart());
    }

    let localWishlistIds: string[] = [...wishlistIds];
    try {
      const rawWishlist = localStorage.getItem(WISHLIST_KEY);
      if (rawWishlist) {
        const parsed = JSON.parse(rawWishlist);
        if (Array.isArray(parsed) && localWishlistIds.length === 0) {
          localWishlistIds = parsed;
        } else if (Array.isArray(parsed)) {
          localWishlistIds = Array.from(new Set([...localWishlistIds, ...parsed]));
        }
      }
    } catch {
      /* ignore */
    }

    if (localWishlistIds.length > 0) {
      dispatch(mergeWishlistWithBackend(localWishlistIds));
    } else {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, token, dispatch, cartItems, wishlistIds]);

  // 3. Sync only when user changed cart (dirty) or persist guest to localStorage
  useEffect(() => {
    if (isAuthenticated && token) {
      if (cartDirty && cartItems.length > 0) {
        const timer = setTimeout(() => dispatch(syncCart(cartItems)), 800);
        return () => clearTimeout(timer);
      }
    } else {
      if (wishlistIds.length > 0) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
      if (cartItems.length > 0) localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartDirty, wishlistIds, cartItems, isAuthenticated, token, dispatch]);

  return null; // This component does not render anything
}
