'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addAddress } from '@/app/actions/account';
import { useState } from 'react';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      await addAddress(data);
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
        <label>Full Name</label>
        <input
          {...register('fullName')}
          className='cult-input'
          placeholder='e.g. John Doe'
        />
        {errors.fullName && (
          <span className='error'>{errors.fullName.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label>Address Line 1</label>
        <input
          {...register('addressLine1')}
          className='cult-input'
          placeholder='e.g. 123 Shadow Lane'
        />
        {errors.addressLine1 && (
          <span className='error'>{errors.addressLine1.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label>Address Line 2 (Optional)</label>
        <input
          {...register('addressLine2')}
          className='cult-input'
          placeholder='Apt, Suite, Etc.'
        />
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <label>City</label>
          <input
            {...register('city')}
            className='cult-input'
            placeholder='City'
          />
          {errors.city && <span className='error'>{errors.city.message}</span>}
        </div>
        <div className='form-group'>
          <label>Postal Code</label>
          <input
            {...register('postalCode')}
            className='cult-input'
            placeholder='ZIP'
          />
          {errors.postalCode && (
            <span className='error'>{errors.postalCode.message}</span>
          )}
        </div>
      </div>

      <div className='form-group'>
        <label>Country</label>
        <input
          {...register('country')}
          className='cult-input'
          placeholder='Country'
        />
        {errors.country && (
          <span className='error'>{errors.country.message}</span>
        )}
      </div>

      <button
        type='submit'
        className='account-btn-primary full-width'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Address'}
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
        .full-width {
          width: 100%;
          justify-content: center;
          margin-top: 1rem;
        }
      `}</style>
    </form>
  );
}
