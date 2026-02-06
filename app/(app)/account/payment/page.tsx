'use client';

import { Plus } from 'lucide-react';

export default function PaymentMethodsPage() {
  return (
    <div className='account-section'>
      <div className='account-section-header'>
        <h3>Payment Methods</h3>
        <button className='account-btn-primary'>
          <Plus size={16} />
          Add New
        </button>
      </div>
      <div className='payment-methods-list'>
        <p className='account-empty'>No payment methods saved.</p>
      </div>
    </div>
  );
}
