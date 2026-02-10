import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, setCartOpen, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
