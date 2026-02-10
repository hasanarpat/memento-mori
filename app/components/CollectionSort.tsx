'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const sortOptions = [
  { value: '-createdAt', label: 'New First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

export default function CollectionSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get('sort') || '-createdAt';
  const currentLabel = sortOptions.find((o) => o.value === currentSort)?.label || 'New First';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/collections?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className='custom-dropdown-wrap' ref={dropdownRef}>
      <button
        className='custom-dropdown-trigger'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='trigger-label'>Sort:</span>
        <span className='trigger-value'>{currentLabel}</span>
        <ChevronDown
          size={14}
          className={isOpen ? 'rotate-180' : ''}
        />
      </button>
      {isOpen && (
        <div className='custom-dropdown-list'>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              className={`custom-dropdown-item ${currentSort === opt.value ? 'active' : ''}`}
              onClick={() => handleSort(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
