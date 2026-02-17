'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { checkAuth } from './slices/authSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    store.dispatch(checkAuth());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
