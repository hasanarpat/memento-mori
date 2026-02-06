'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/app/components/Modal';
import PaymentForm from '@/app/components/account/PaymentForm';

export default function PaymentMethodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='account-section'>
      <div className='account-section-header'>
        <h3>Payment Methods</h3>
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
