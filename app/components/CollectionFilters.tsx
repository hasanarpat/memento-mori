'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Filter, X } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface CollectionFiltersProps {
  categories: Category[];
  productTypes: { label: string; value: string }[];
}

export default function CollectionFilters({
  categories,
  productTypes,
}: CollectionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    world: true,
    type: true,
    price: true,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentGenre = searchParams.get('genre') || 'all';
  const currentType = searchParams.get('type') || 'all';
  const currentMinPrice = parseInt(searchParams.get('minPrice') || '0', 10);
  const currentMaxPrice = parseInt(searchParams.get('maxPrice') || '2000', 10);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <button 
        className="mobile-filter-trigger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Filter size={18} />
        {mobileMenuOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      <aside className={`filters-sidebar ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
        <div className="sidebar-header-mobile">
           <span>Filters</span>
           <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
        </div>

        {/* World Section */}
        <div className={`filter-section ${openSections.world ? 'open' : ''}`}>
          <button
            type='button'
            className='filter-title-btn'
            onClick={() => toggleSection('world')}
          >
            <span>World</span>
            <ChevronDown
              size={14}
              className={openSections.world ? 'rotate-180' : ''}
            />
          </button>

          <div className='filter-content'>
            <label className='filter-option-minimal'>
              <input
                type='radio'
                name='genre'
                checked={currentGenre === 'all'}
                onChange={() => updateFilters({ genre: 'all' })}
              />
              <span className='option-label'>All Worlds</span>
            </label>
            {categories.map((c) => (
              <label key={c.id} className='filter-option-minimal'>
                <input
                  type='radio'
                  name='genre'
                  checked={currentGenre === c.slug}
                  onChange={() => updateFilters({ genre: c.slug })}
                />
                <span className='option-label'>{c.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type Section */}
        <div className={`filter-section ${openSections.type ? 'open' : ''}`}>
          <button
            type='button'
            className='filter-title-btn'
            onClick={() => toggleSection('type')}
          >
            <span>Type</span>
            <ChevronDown
              size={14}
              className={openSections.type ? 'rotate-180' : ''}
            />
          </button>

          <div className='filter-content'>
            <label className='filter-option-minimal'>
              <input
                type='radio'
                name='type'
                checked={currentType === 'all'}
                onChange={() => updateFilters({ type: 'all' })}
              />
              <span className='option-label'>All Types</span>
            </label>
            {productTypes.map((t) => (
              <label key={t.value} className='filter-option-minimal'>
                <input
                  type='radio'
                  name='type'
                  checked={currentType === t.value}
                  onChange={() => updateFilters({ type: t.value })}
                />
                <span className='option-label'>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className={`filter-section ${openSections.price ? 'open' : ''}`}>
          <button
            type='button'
            className='filter-title-btn'
            onClick={() => toggleSection('price')}
          >
            <span>Price</span>
            <ChevronDown
              size={14}
              className={openSections.price ? 'rotate-180' : ''}
            />
          </button>

          <div className='filter-content'>
            <div className='filter-price-display'>
              ₺{currentMinPrice} – ₺{currentMaxPrice}
            </div>

            <div className='dual-slider-container'>
              <div className='slider-track'></div>
              <input
                type='range'
                min={0}
                max={2000}
                step={10}
                value={currentMinPrice}
                onChange={(e) => {
                  const val = Math.min(parseInt(e.target.value, 10), currentMaxPrice - 100);
                  updateFilters({ minPrice: val });
                }}
                className='price-slider min-slider'
                style={{ zIndex: currentMinPrice > 1000 ? 5 : 3 }}
              />
              <input
                type='range'
                min={0}
                max={2000}
                step={10}
                value={currentMaxPrice}
                onChange={(e) => {
                  const val = Math.max(parseInt(e.target.value, 10), currentMinPrice + 100);
                  updateFilters({ maxPrice: val });
                }}
                className='price-slider max-slider'
                style={{ zIndex: currentMinPrice > 1000 ? 3 : 5 }}
              />
            </div>

            <div className='price-inputs-row'>
              <div className='price-input-wrap static'>
                <span className='price-currency'>₺</span>
                <span className='price-value'>{currentMinPrice}</span>
              </div>
              <span className='price-separator'>-</span>
              <div className='price-input-wrap static'>
                <span className='price-currency'>₺</span>
                <span className='price-value'>{currentMaxPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar-footer'>
          <button
            type='button'
            className='clear-filters-minimal'
            onClick={() => {
              router.push(window.location.pathname);
              setMobileMenuOpen(false);
            }}
          >
            Reset All Filters
          </button>
        </div>
      </aside>
    </>
  );
}
