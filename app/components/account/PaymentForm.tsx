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
      {/* Virtual Card Preview */}
      <div className='virtual-card-preview'>
        <div className='card-chip' />
        <div className='card-number-display'>
          {register('cardNumber')
            ? '**** **** **** ****'
            : '0000 0000 0000 0000'}
        </div>
        <div className='card-bottom'>
          <div className='card-holder'>
            <span className='label'>Card Holder</span>
            <span className='value'>MORTAL GUEST</span>
          </div>
          <div className='card-expiry'>
            <span className='label'>Expires</span>
            <span className='value'>MM/YY</span>
          </div>
          <CreditCard className='card-logo' size={24} />
        </div>
      </div>

      <div className='form-fields'>
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
      </div>

      <button
        type='submit'
        className='account-btn-primary full-width'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Add Payment Method'}
      </button>

      <style jsx>{`
        .account-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem 0;
        }

        /* Virtual Card Styling */
        .virtual-card-preview {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          border: 1px solid rgba(139, 115, 85, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          aspect-ratio: 1.6 / 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .virtual-card-preview::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(139, 115, 85, 0.05) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
        .card-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(135deg, #d4af37 0%, #8b7355 100%);
          border-radius: 4px;
          opacity: 0.6;
        }
        .card-number-display {
          font-family: 'Courier New', monospace;
          font-size: 1.25rem;
          letter-spacing: 4px;
          color: var(--bone);
          word-spacing: 8px;
          margin-top: 1rem;
        }
        .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
        }
        .card-holder,
        .card-expiry {
          display: flex;
          flex-direction: column;
        }
        .label {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          color: var(--aged-silver);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .value {
          font-family: 'Crimson Text', serif;
          font-size: 0.9rem;
          color: var(--bone);
          letter-spacing: 1px;
        }
        .card-logo {
          color: var(--aged-brass);
          opacity: 0.5;
        }

        .form-fields {
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
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          color: var(--aged-silver);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .error {
          color: var(--blood-red);
          font-size: 0.8rem;
          font-family: 'Crimson Text', serif;
          font-style: italic;
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
          opacity: 0.5;
          pointer-events: none;
        }
        .full-width {
          width: 100%;
          justify-content: center;
          margin-top: 0.5rem;
        }
      `}</style>
    </form>
  );
}
