'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addPaymentMethod } from '@/app/actions/account';
import { useState } from 'react';
import { CreditCard } from 'lucide-react';

const paymentSchema = z.object({
  cardName: z.string().min(2, 'Name on card is required'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiry (MM/YY)'),
  cvc: z.string().min(3, 'CVC is required').max(4),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      await addPaymentMethod(data);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='account-form'>
      <div className='form-group'>
        <label>Name on Card</label>
        <input
          {...register('cardName')}
          className='cult-input'
          placeholder='e.g. John Doe'
        />
        {errors.cardName && (
          <span className='error'>{errors.cardName.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label>Card Number</label>
        <div className='input-icon-wrap'>
          <input
            {...register('cardNumber')}
            className='cult-input with-icon'
            placeholder='0000 0000 0000 0000'
          />
          <CreditCard className='input-icon' size={20} />
        </div>
        {errors.cardNumber && (
          <span className='error'>{errors.cardNumber.message}</span>
        )}
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <label>Expiry Date</label>
          <input
            {...register('expiry')}
            className='cult-input'
            placeholder='MM/YY'
          />
          {errors.expiry && (
            <span className='error'>{errors.expiry.message}</span>
          )}
        </div>
        <div className='form-group'>
          <label>CVC</label>
          <input
            {...register('cvc')}
            className='cult-input'
            placeholder='123'
          />
          {errors.cvc && <span className='error'>{errors.cvc.message}</span>}
        </div>
      </div>

      <button
        type='submit'
        className='account-btn-primary full-width'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Payment Method'}
      </button>

      <style jsx>{`
        .account-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .form-row .form-group {
          flex: 1;
        }
        label {
          font-size: 0.85rem;
          color: var(--aged-silver);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .error {
          color: var(--blood-red);
          font-size: 0.8rem;
        }
        .input-icon-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--aged-silver);
          pointer-events: none;
        }
        .cult-input.with-icon {
          padding-right: 2.5rem;
        }
        .full-width {
          width: 100%;
          justify-content: center;
          margin-top: 1rem;
        }
      `}</style>
    </form>
  );
}
