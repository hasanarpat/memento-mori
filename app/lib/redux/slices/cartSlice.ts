import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface CartItem {
  id: string | number; // Product ID
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: any; // Lexical editor format
    images?: any;
    productType?: string;
    theme?: string;
    category?: any[];
    stock?: number;
    badge?: string | null;
    isNewArrival?: boolean;
    isFeatured?: boolean;
  };
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  dirty: boolean;
  /** True while fetchCart or mergeCartWithBackend is in progress */
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  dirty: false,
  loading: false,
};


// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;
    if (!token) throw new Error('No token');

    const res = await fetch('/api/shop/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch cart');
    const data = await res.json();
    
    // Map backend response to CartItem structure if needed
    // Backend returns product object populated.
    return data.cart.map((item: any) => ({
      id: item.product.id,
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
    }));
  }
);

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (items: CartItem[], { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;
    if (!token) return; // Silent return if not auth

    await fetch('/api/shop/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.dirty = true;
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.dirty = true;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string | number; quantity: number }>) => {
      state.dirty = true;
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.dirty = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.dirty = false;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(mergeCartWithBackend.pending, (state) => {
        state.loading = true;
      })
      .addCase(mergeCartWithBackend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(mergeCartWithBackend.rejected, (state) => {
        state.loading = false;
      })
      .addCase(syncCart.fulfilled, (state) => {
        state.dirty = false;
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, setCartOpen, clearCart, setCartItems } = cartSlice.actions;

export const mergeCartWithBackend = createAsyncThunk(
  'cart/mergeCartWithBackend',
  async (localItems: CartItem[], { dispatch, getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token;
    if (!token) return;

    try {
      // 1. Fetch Backend Cart
      const res = await fetch('/api/shop/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to fetch backend cart for merge');
      const data = await res.json();
      
      const backendItems = data.cart.map((item: any) => ({
        id: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })) as CartItem[];

      // 2. Merge Strategies (Local + Backend)
      // Map by ID
      const mergedMap = new Map<string | number, CartItem>();

      // Add backend items first
      backendItems.forEach(item => mergedMap.set(item.id, { ...item }));

      // Merge local items: same product → take max quantity (avoid double-count on F5)
      localItems.forEach(localItem => {
         if (mergedMap.has(localItem.id)) {
            const existing = mergedMap.get(localItem.id)!;
            existing.quantity = Math.max(existing.quantity, localItem.quantity);
         } else {
            mergedMap.set(localItem.id, localItem);
         }
      });

      const mergedItems = Array.from(mergedMap.values());

      // 3. Sync merged list to Backend
      await dispatch(syncCart(mergedItems));

      // 4. Update local state from merged result (avoid extra GET)
      dispatch(setCartItems(mergedItems));

    } catch (err) {
      console.error('Merge cart failed', err);
    }
  }
);
export default cartSlice.reducer;
