'use client';

import { Plus } from 'lucide-react';

export default function AddressesPage() {
  return (
    <div className='account-section'>
      <div className='account-section-header'>
        <h3>Addresses</h3>
        <button className='account-btn-primary'>
          <Plus size={16} />
          Add New
        </button>
      </div>
      <div className='addresses-grid'>
        <p className='account-empty'>No addresses saved.</p>
      </div>
    </div>
  );
}
