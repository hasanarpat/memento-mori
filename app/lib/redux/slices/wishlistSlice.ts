import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Product {
  id: string;
  name: string;
  price: number;
  category: unknown;
  theme: string;
  badge?: string;
  images?: { url?: string } | null;
  slug?: string;
}

interface WishlistState {
  wishlistIds: string[];
  wishlistProducts: Product[];
  loading: boolean;
}

const initialState: WishlistState = {
  wishlistIds: [],
  wishlistProducts: [],
  loading: false,
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

    // Backend returns array of Product objects (due to depth: 1)
    const products = data.wishlist as Product[];
    const ids = products.map(p => p.id);

    return { ids, products };
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
        state.wishlistProducts = state.wishlistProducts.filter((item) => item.id !== id);
      } else {
        state.wishlistIds.push(id);
        // Note: We can't add the product object here easily unless we pass it in payload.
        // For now, the ID add is immediate for UI feedback (heart icon), 
        // but the Wishlist Page might need a refetch if it wasn't already loaded.
      }
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.wishlistIds = action.payload;
    },
    clearWishlist: (state) => {
      state.wishlistIds = [];
      state.wishlistProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistIds = action.payload.ids;
        state.wishlistProducts = action.payload.products;

        if (typeof window !== 'undefined') {
          localStorage.setItem('memento-wishlist', JSON.stringify(action.payload.ids));
        }
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
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


export const mergeWishlistWithBackend = createAsyncThunk(
  'wishlist/mergeWishlistWithBackend',
  async (localIds: string[], { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) return;

    try {
      // 1. Fetch Backend Wishlist to get current server IDs
      // We use the existing endpoint which returns populated products
      const res = await fetch('/api/shop/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch backend wishlist for merge');
      const data = await res.json();
      const backendProducts = data.wishlist as Product[];
      const backendIds = backendProducts.map(p => p.id);

      // 2. Merge Strategies (Set for unique IDs)
      const mergedSet = new Set([...backendIds, ...localIds]);
      const mergedIds = Array.from(mergedSet);

      // 3. Sync merged list to Backend
      await dispatch(syncWishlist(mergedIds));

      // 4. Update local state
      // We should ideally fetch full products again if we added local ones that weren't on server.
      // But for now, let's at least trigger a fetch to get the full objects for the UI.
      dispatch(fetchWishlist());

    } catch (err) {
      console.error('Merge wishlist failed', err);
    }
  }
);

export default wishlistSlice.reducer;
