import StoreProvider from '../lib/redux/provider';
import ShopLayout from '@/components/ShopLayout';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <ShopLayout>{children}</ShopLayout>
    </StoreProvider>
  );
}
