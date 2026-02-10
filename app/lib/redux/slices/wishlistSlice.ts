import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  wishlistIds: string[];
}

const initialState: WishlistState = {
  wishlistIds: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = String(action.payload);
      if (state.wishlistIds.includes(id)) {
        state.wishlistIds = state.wishlistIds.filter((item) => item !== id);
      } else {
        state.wishlistIds.push(id);
      }
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.wishlistIds = action.payload;
    },
    clearWishlist: (state) => {
      state.wishlistIds = [];
    }
  },
});

export const { toggleWishlist, setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
