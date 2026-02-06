'use client';

import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className='account-section'>
      <div className='account-header'>
        <h1 className='account-title'>Account Settings</h1>
        <p className='account-subtitle'>
          Update your personal details and security preferences.
        </p>
      </div>

      <form className='settings-form' onSubmit={(e) => e.preventDefault()}>
        <div className='form-group'>
          <label>Full Name</label>
          <input type='text' placeholder='Guest' className='cult-input' />
        </div>
        <div className='form-group'>
          <label>Email Address</label>
          <input
            type='email'
            placeholder='guest@example.com'
            className='cult-input'
          />
        </div>

        <h4 className='mt-8 mb-4'>Change Password</h4>
        <div className='form-group'>
          <label>Current Password</label>
          <input type='password' className='cult-input' />
        </div>
        <div className='form-group'>
          <label>New Password</label>
          <input type='password' className='cult-input' />
        </div>

        <button type='submit' className='account-btn-primary mt-6'>
          <Save size={16} />
          Save Changes
        </button>
      </form>

      <style jsx>{`
        .settings-form {
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-primary);
          font-family: inherit;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--aged-brass);
        }
        .mt-8 {
          margin-top: 2rem;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .mt-6 {
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
}
