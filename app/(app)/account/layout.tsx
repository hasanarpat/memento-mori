'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Settings,
  LogOut,
  Ruler,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { logout } from '@/app/lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

const MENU = [
  { href: '/account', icon: User, label: 'Dashboard' },
  { href: '/account/orders', icon: Package, label: 'Orders' },
  { href: '/account/size-profile', icon: Ruler, label: 'Size Profile' },
  { href: '/account/addresses', icon: MapPin, label: 'Addresses' },
  { href: '/account/payment', icon: CreditCard, label: 'Payment Methods' },
  { href: '/account/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/account/settings', icon: Settings, label: 'Settings' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    // Check localStorage validation to prevent race conditions (state may be resetting on refresh)
    const hasToken = typeof window !== 'undefined' ? localStorage.getItem('payload-token') : null;
    
    // Only redirect if absolutely sure: not loading, not auth in state, AND no token in storage
    // (If checkAuth fails, it clears storage, so this will eventually redirect)
    if (!loading && !isAuthenticated && !hasToken) {
      router.push(`/login?return=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, loading, router, pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const displayName = user?.name 
    ? (user.surname ? `${user.name} ${user.surname}` : user.name)
    : (user?.email?.split('@')[0] || 'Guest');
  
  const initial = user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'G');

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className='account-page' style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        color: 'var(--bone)',
        fontFamily: 'Cinzel, serif'
      }}>
        Loading...
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='account-page'>
      <div className='account-layout'>
        <aside className='account-sidebar'>
          <div className='account-user'>
            <div
              className='account-avatar'
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(139,115,85,0.3)',
                border: '2px solid var(--aged-brass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'var(--bone)',
                fontFamily: 'Cinzel, serif'
              }}
            >
              {initial}
            </div>
            <span className='account-name'>{displayName}</span>
          </div>
          <nav className='account-nav' aria-label='Account menu'>
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`account-nav-link ${
                  pathname === item.href ? 'active' : ''
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
            <button 
              type='button' 
              className='account-nav-link'
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </aside>
        <main className='account-main'>{children}</main>
      </div>
    </div>
  );
}
