'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import { setUser } from '../../lib/redux/slices/authSlice';

function LoginContentByHasan() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  useAppSelector((state) => state.auth); // auth state available for future use

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const phone = formData.get('phone') as string;
    const age = formData.get('age') as string;
    const gender = formData.get('gender') as string;

    // Client-side validation
    if (tab === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint =
        tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body =
        tab === 'login'
          ? { email, password }
          : { email, password, name, surname, phone, age, gender };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Success handling: If we have a token (login or auto-login after register)
      if (data.token) {
        // Set cookie immediately to prevent server-side redirect loops
        document.cookie = `payload-token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

        // Update Redux state immediately
        dispatch(
          setUser({
            user: data.user,
            token: data.token,
          }),
        );

        // Token is also saved to localStorage by the setUser reducer
        // Dispatch auth-change event for any other listeners
        window.dispatchEvent(new Event('auth-change'));
        // Redirect back to the page user was on, or account
        const returnTo = searchParams.get('return') || searchParams.get('redirect') || '';
        const safeReturn = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') && !returnTo.toLowerCase().startsWith('/login');
        router.push(safeReturn ? returnTo : '/account');
        return;
      }

      // If no token (fallback for register without auto-login), show success message
      if (tab === 'register' && data.success) {
        setTab('login');
        setError(
          data.message || 'Account created successfully! Please sign in.',
        );
        return;
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-bg'>
        <div className='auth-bg-gradient' />
        <div className='auth-bg-pattern' />
      </div>
      <div className='auth-container'>
        <div className='auth-card'>
          <div className='auth-card-border' aria-hidden />
          <div className='auth-card-inner'>
            <div className='auth-header'>
              <span className='auth-symbol'>☠</span>
              <h1 className='auth-title'>MEMENTO MORI</h1>
              <p className='auth-subtitle'>Enter the commune</p>
            </div>
            <div className='auth-tabs'>
              <button
                type='button'
                className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
              >
                LOGIN
              </button>
              <button
                type='button'
                className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setTab('register');
                  setError('');
                }}
              >
                REGISTER
              </button>
            </div>

            {error && (
              <div
                className={`auth-message ${error.includes('success') ? 'success' : 'error'}`}
                style={{
                  color: error.includes('success') ? '#4ade80' : '#ef4444',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            <form className='auth-form' onSubmit={handleSubmit}>
              {tab === 'register' && (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                    }}
                  >
                    <label className='auth-label'>
                      Name
                      <span className='auth-input-wrap'>
                        <input
                          name='name'
                          type='text'
                          placeholder='John'
                          required
                        />
                      </span>
                    </label>
                    <label className='auth-label'>
                      Surname
                      <span className='auth-input-wrap'>
                        <input
                          name='surname'
                          type='text'
                          placeholder='Doe'
                          required
                        />
                      </span>
                    </label>
                  </div>
                  <label className='auth-label'>
                    Phone Number
                    <span className='auth-input-wrap'>
                      <input name='phone' type='tel' placeholder='+1...' />
                    </span>
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                    }}
                  >
                    <label className='auth-label'>
                      Age
                      <span className='auth-input-wrap'>
                        <input
                          name='age'
                          type='number'
                          min='18'
                          placeholder='25'
                        />
                      </span>
                    </label>
                    <label className='auth-label'>
                      Gender
                      <span className='auth-input-wrap'>
                        <select
                          name='gender'
                          style={{
                            width: '100%',
                            background: 'transparent',
                            color: 'inherit',
                            border: 'none',
                            padding: '0.5rem',
                          }}
                        >
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                          <option value='other'>Other</option>
                          <option value='unsure'>Prefer not to say</option>
                        </select>
                      </span>
                    </label>
                  </div>
                </>
              )}
              <label className='auth-label'>
                Email
                <span className='auth-input-wrap'>
                  <Mail className='auth-input-icon' size={18} />
                  <input
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    required
                    autoComplete='email'
                  />
                </span>
              </label>
              <label className='auth-label'>
                Password
                <span className='auth-input-wrap'>
                  <Lock className='auth-input-icon' size={18} />
                  <input
                    name='password'
                    type='password'
                    placeholder='••••••••'
                    required
                    minLength={8}
                    autoComplete={
                      tab === 'login' ? 'current-password' : 'new-password'
                    }
                  />
                </span>
              </label>
              {tab === 'register' && (
                <label className='auth-label'>
                  Confirm password
                  <span className='auth-input-wrap'>
                    <Lock className='auth-input-icon' size={18} />
                    <input
                      name='confirmPassword'
                      type='password'
                      placeholder='••••••••'
                      required
                      minLength={8}
                      autoComplete='new-password'
                    />
                  </span>
                </label>
              )}
              <button type='submit' className='auth-submit' disabled={loading}>
                {loading
                  ? 'PROCESSING...'
                  : tab === 'login'
                    ? 'SIGN IN'
                    : 'CREATE ACCOUNT'}
              </button>
            </form>
            <div className='auth-footer'>
              <Link href='/'>← Return to the shop</Link>
            </div>
            <p className='auth-tagline'>From dust to dust.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContentByHasan />
    </Suspense>
  );
}
