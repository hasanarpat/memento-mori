'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { checkAuth } from './slices/authSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const initialized = useRef(false);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Only run once on mount
    if (!initialized.current && storeRef.current) {
      initialized.current = true;
      // Try to restore auth state from localStorage
      storeRef.current.dispatch(checkAuth());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
