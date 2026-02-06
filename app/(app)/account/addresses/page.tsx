'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/app/components/Modal';
import AddressForm from '@/app/components/account/AddressForm';

export default function AddressesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='account-section'>
      <div className='account-section-header'>
        <h3>Addresses</h3>
        <button
          className='account-btn-primary'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      <div className='addresses-grid'>
        <p className='account-empty'>No addresses saved.</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Add New Address'
      >
        <AddressForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
