import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface CartItem {
  id: string | number; // Product ID
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    images?: any[];
  };
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // UI State (Sidebar)
}

const initialState: CartState = {
  items: [],
  isOpen: false,
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
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string | number; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
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
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      // Merge strategy: Server has truth
      // Or local overrides?
      // Since we want persist across devices, server wins on login.
      // But if user added items as guest then logged in?
      // For now, simpler: Server wins.
      state.items = action.payload;
    });
  }
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, setCartOpen, clearCart } = cartSlice.actions;

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

      // Merge local items
      localItems.forEach(localItem => {
         if (mergedMap.has(localItem.id)) {
            const existing = mergedMap.get(localItem.id)!;
            existing.quantity += localItem.quantity;
         } else {
            mergedMap.set(localItem.id, localItem);
         }
      });

      const mergedItems = Array.from(mergedMap.values());

      // 3. Sync merged list to Backend
      await dispatch(syncCart(mergedItems));

      // 4. Update Local State (via fetchCart or manually setting state)
      // Since syncCart updates backend, we can just set state or re-fetch.
      // Re-fetching is safer to ensure backend consistency.
      await dispatch(fetchCart());

    } catch (err) {
      console.error('Merge cart failed', err);
    }
  }
);
export default cartSlice.reducer;
