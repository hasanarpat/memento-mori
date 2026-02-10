import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface WishlistState {
  wishlistIds: string[];
}

const initialState: WishlistState = {
  wishlistIds: [],
};

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) throw new Error('No token');

    const res = await fetch('/api/shop/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch wishlist');
    const data = await res.json();
    
    // Backend returns array of Products or IDs
    // We store IDs as strings in slice
    return data.wishlist.map((item: any) => typeof item === 'object' ? String(item.id) : String(item));
  }
);

export const syncWishlist = createAsyncThunk(
  'wishlist/syncWishlist',
  async (ids: string[], { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) return;

    await fetch('/api/shop/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productIds: ids }),
    });
  }
);



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
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.wishlistIds = action.payload;
      if (typeof window !== 'undefined') {
         localStorage.setItem('memento-wishlist', JSON.stringify(action.payload));
      }
    });
  }
});

export const { toggleWishlist, setWishlist, clearWishlist } = wishlistSlice.actions;

export const modifyWishlist = createAsyncThunk(
  'wishlist/modify',
  async (id: string, { dispatch, getState }) => {
    dispatch(toggleWishlist(id));
    
    const state = getState() as RootState;
    const { wishlistIds } = state.wishlist;
    const token = state.auth.token;

    if (token) {
       await dispatch(syncWishlist(wishlistIds));
    } else {
       if (typeof window !== 'undefined') {
          localStorage.setItem('memento-wishlist', JSON.stringify(wishlistIds));
       }
    }
  }
);

export default wishlistSlice.reducer;
