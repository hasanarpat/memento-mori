'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/app/components/Modal';
import PaymentForm from '@/app/components/account/PaymentForm';

export default function PaymentMethodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='account-section'>
      <div
        className='account-header'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <h1 className='account-title'>Payment Methods</h1>
          <p className='account-subtitle'>
            Securely manage your saved cards and payment options.
          </p>
        </div>
        <button
          className='account-btn-primary'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      <div className='payment-methods-list'>
        <p className='account-empty'>No payment methods saved.</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Add Payment Method'
      >
        <PaymentForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
