import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, _store) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('payload-token') : null;
    if (!token) throw new Error('No token');

    const res = await fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Auth failed');
    const data = await res.json();
    
    // Payload /api/users/me returns { user: ... }
    if (!data.user) throw new Error('No user found');
    
    return { user: data.user, token };
  }
);

export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  age?: number;
  gender?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('payload-token', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('payload-token');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        if (typeof window !== 'undefined') localStorage.removeItem('payload-token');
      });
  }
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
