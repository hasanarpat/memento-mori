'use client';

import { useState, useEffect } from 'react';
import { Tag, Copy, Check } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount?: number;
  validUntil?: string;
  applicableToNewUsersOnly: boolean;
  maxUsesPerUser?: number;
}

interface AvailableCouponsProps {
  onApplyCoupon: (code: string) => void;
}

export default function AvailableCoupons({ onApplyCoupon }: AvailableCouponsProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/shop/coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const applyCoupon = (code: string) => {
    onApplyCoupon(code);
  };

  if (loading) {
    return (
      <div className='available-coupons-loading'>
        <div className='coupon-spinner'></div>
        <span>Loading available coupons...</span>
      </div>
    );
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <div className='available-coupons'>
      <div className='available-coupons-header'>
        <Tag size={18} />
        <h3>Available Coupons</h3>
      </div>
      <div className='available-coupons-grid'>
        {coupons.map((coupon) => (
          <div key={coupon.id} className='coupon-card'>
            <div className='coupon-card-header'>
              <div className='coupon-code-badge'>
                {coupon.code}
              </div>
              {coupon.applicableToNewUsersOnly && (
                <span className='coupon-new-user-badge'>New Users</span>
              )}
            </div>
            
            <div className='coupon-card-body'>
              <div className='coupon-discount'>
                {coupon.discountType === 'percentage' ? (
                  <span className='coupon-discount-value'>{coupon.discountValue}% OFF</span>
                ) : (
                  <span className='coupon-discount-value'>₺{coupon.discountValue} OFF</span>
                )}
              </div>
              
              {coupon.description && (
                <p className='coupon-description'>{coupon.description}</p>
              )}
              
              <div className='coupon-conditions'>
                {coupon.minimumOrderAmount && (
                  <span className='coupon-condition'>
                    Min. Order: ₺{coupon.minimumOrderAmount}
                  </span>
                )}
                {coupon.validUntil && (
                  <span className='coupon-condition'>
                    Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className='coupon-card-actions'>
              <button
                type='button'
                className='coupon-copy-btn'
                onClick={() => copyCode(coupon.code)}
                title='Copy code'
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
              <button
                type='button'
                className='coupon-apply-btn'
                onClick={() => applyCoupon(coupon.code)}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
