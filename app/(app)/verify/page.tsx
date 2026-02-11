'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/users/verify/${token}`, {
          method: 'POST',
        });

        if (res.ok) {
          setStatus('success');
          // Refresh auth state after 2 seconds
          setTimeout(() => {
             window.dispatchEvent(new Event('auth-change'));
             router.push('/account');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Verification failed or token expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {status === 'loading' && (
        <>
          <Loader2 size={48} className="text-[#666] mb-6 animate-spin" />
          <h2 className="text-2xl font-serif text-[#e0e0e0] mb-2">Verifying Existence...</h2>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle size={48} className="text-green-500 mb-6" />
          <h2 className="text-2xl font-serif text-[#e0e0e0] mb-2">Verified</h2>
          <p className="text-[#666] mb-6">You have been recognized by the void. Redirecting...</p>
          <Link href="/account" className="px-6 py-2 border border-[#333] text-[#e0e0e0] hover:bg-[#1a1a1a]">
            Proceed to Account
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle size={48} className="text-red-500 mb-6" />
          <h2 className="text-2xl font-serif text-[#e0e0e0] mb-2">Verification Failed</h2>
          <p className="text-[#666] mb-6">{message}</p>
          <Link href="/contact" className="px-6 py-2 border border-[#333] text-[#e0e0e0] hover:bg-[#1a1a1a]">
            Contact Support
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-[#666]">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
