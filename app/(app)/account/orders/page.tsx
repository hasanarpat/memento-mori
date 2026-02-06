'use client';

import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className='account-section'>
      <h3>My Orders</h3>
      <div className='orders-list'>
        <p className='account-empty'>You haven&apos;t placed any orders yet.</p>
        <Link href='/collections' className='home-cta-outline'>
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
