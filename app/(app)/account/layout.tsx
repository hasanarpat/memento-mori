'use client';

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
} from 'lucide-react';

const MENU = [
  { href: '/account', icon: User, label: 'Dashboard' },
  { href: '/account/orders', icon: Package, label: 'Orders' },
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

  return (
    <div className='account-page'>
      <h1 className='home-section-title'>My Account</h1>
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
              }}
            />
            <span className='account-name'>Guest</span>
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
            <button type='button' className='account-nav-link'>
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
