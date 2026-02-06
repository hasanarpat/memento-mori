'use client';

import Link from 'next/link';

export default function AccountPage() {
  return (
    <>
      <div className='account-header'>
        <h1 className='account-title'>Dashboard</h1>
        <p className='account-subtitle'>
          Welcome back. Manage your orders, addresses, and account details.
        </p>
      </div>
      <div className='account-cards'>
        <div className='account-card'>
          <span className='account-card-value'>0</span>
          <span className='account-card-label'>Total Orders</span>
        </div>
        <div className='account-card'>
          <span className='account-card-value'>0</span>
          <span className='account-card-label'>Pending</span>
        </div>
        <div className='account-card'>
          <span className='account-card-value'>0</span>
          <span className='account-card-label'>Wishlist Items</span>
        </div>
      </div>
      <div className='account-recent'>
        <h3>Recent Orders</h3>
        <p className='account-empty'>No orders yet. Start shopping.</p>
        <Link href='/collections' className='home-cta-outline'>
          Browse Collections
        </Link>
      </div>
    </>
  );
}
