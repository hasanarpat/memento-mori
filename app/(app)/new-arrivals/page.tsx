'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { products } from '../../data/shop';

type DateGroup = 'this-week' | 'last-week' | 'this-month';

const newProducts = products.filter((p) => p.new);
const allDisplay =
  newProducts.length >= 8 ? newProducts : products.slice(0, 12);

// Simulate date groups: first 3 = This Week, next 3 = Last Week, rest = This Month
const thisWeek = allDisplay.slice(0, 3);
const lastWeek = allDisplay.slice(3, 6);
const thisMonth = allDisplay.slice(6, 12);

const categories = Array.from(
  new Set(allDisplay.flatMap((p) => p.category.split(' × '))),
);

export default function NewArrivalsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [newThisWeekOnly, setNewThisWeekOnly] = useState(false);
  const [openSection, setOpenSection] = useState<DateGroup | null>('this-week');

  const filterProduct = (p: (typeof products)[0]) => {
    const matchCat =
      categoryFilter === 'all' ||
      p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchWeek = !newThisWeekOnly || thisWeek.some((t) => t.id === p.id);
    return matchCat && matchPrice && matchWeek;
  };
  const thisWeekFiltered = thisWeek.filter(filterProduct);
  const lastWeekFiltered = lastWeek.filter(filterProduct);
  const thisMonthFiltered = thisMonth.filter(filterProduct);

  const ProductCard = ({ product }: { product: (typeof products)[0] }) => (
    <Link
      href={`/product/${product.id}`}
      className='home-product-card new-arrivals-card'
    >
      <div className='home-product-image'>
        {(product.badge || product.new) && (
          <span className='home-product-badge'>{product.badge || 'NEW'}</span>
        )}
      </div>
      <div className='home-product-info'>
        <h3 className='home-product-name'>{product.name}</h3>
        <p className='home-product-category'>{product.category}</p>
        <p className='home-product-price'>₺{product.price}</p>
      </div>
    </Link>
  );

  return (
    <div className='new-arrivals-page'>
      <header className='new-arrivals-hero'>
        <h1 className='home-hero-title' style={{ marginBottom: '0.5rem' }}>
          New Arrivals
        </h1>
        <p className='home-hero-tagline'>Fresh from the forge</p>
        <p className='new-arrivals-updated'>Last updated: This week</p>
      </header>

      <div className='new-arrivals-layout'>
        <aside className='new-arrivals-filters'>
          <h3 className='filter-title'>Filters</h3>
          <div className='filter-section'>
            <span className='filter-label'>Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='filter-select'
              aria-label='Filter by category'
            >
              <option value='all'>All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className='filter-section'>
            <span className='filter-label'>Price</span>
            <div className='filter-price-display'>
              ₺{priceRange[0]} – ₺{priceRange[1]}
            </div>

            <div className='dual-slider-container'>
              <div className='slider-track'></div>
              <input
                type='range'
                min={0}
                max={1000}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(
                    parseInt(e.target.value, 10),
                    priceRange[1] - 50,
                  );
                  setPriceRange([val, priceRange[1]]);
                }}
                className='price-slider min-slider'
                style={{ zIndex: priceRange[0] > 500 ? 5 : 3 }}
              />
              <input
                type='range'
                min={0}
                max={1000}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(
                    parseInt(e.target.value, 10),
                    priceRange[0] + 50,
                  );
                  setPriceRange([priceRange[0], val]);
                }}
                className='price-slider max-slider'
                style={{ zIndex: priceRange[0] > 500 ? 3 : 5 }}
              />
            </div>

            <div className='price-inputs-row'>
              <div className='price-input-wrap static'>
                <span className='price-currency'>₺</span>
                <span className='price-value'>{priceRange[0]}</span>
              </div>
              <span className='price-separator'>-</span>
              <div className='price-input-wrap static'>
                <span className='price-currency'>₺</span>
                <span className='price-value'>{priceRange[1]}</span>
              </div>
            </div>
          </div>
          <label className='filter-checkbox'>
            <input
              type='checkbox'
              checked={newThisWeekOnly}
              onChange={(e) => setNewThisWeekOnly(e.target.checked)}
            />
            New This Week
          </label>
        </aside>

        <div className='new-arrivals-main'>
          <section className='new-arrivals-group'>
            <button
              type='button'
              className='new-arrivals-group-head'
              onClick={() =>
                setOpenSection(openSection === 'this-week' ? null : 'this-week')
              }
              aria-expanded={openSection === 'this-week'}
            >
              <h2 className='new-arrivals-group-title'>This Week</h2>
              {openSection === 'this-week' ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {openSection === 'this-week' && (
              <div className='home-products-grid new-arrivals-grid'>
                {thisWeekFiltered.length ? (
                  thisWeekFiltered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                ) : (
                  <p className='new-arrivals-empty'>No items this week.</p>
                )}
              </div>
            )}
          </section>

          <section className='new-arrivals-group'>
            <button
              type='button'
              className='new-arrivals-group-head'
              onClick={() =>
                setOpenSection(openSection === 'last-week' ? null : 'last-week')
              }
              aria-expanded={openSection === 'last-week'}
            >
              <h2 className='new-arrivals-group-title'>Last Week</h2>
              {openSection === 'last-week' ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {openSection === 'last-week' && (
              <div className='home-products-grid new-arrivals-grid'>
                {lastWeekFiltered.length ? (
                  lastWeekFiltered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                ) : (
                  <p className='new-arrivals-empty'>No items.</p>
                )}
              </div>
            )}
          </section>

          <section className='new-arrivals-group'>
            <button
              type='button'
              className='new-arrivals-group-head'
              onClick={() =>
                setOpenSection(
                  openSection === 'this-month' ? null : 'this-month',
                )
              }
              aria-expanded={openSection === 'this-month'}
            >
              <h2 className='new-arrivals-group-title'>This Month</h2>
              {openSection === 'this-month' ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {openSection === 'this-month' && (
              <div className='home-products-grid new-arrivals-grid'>
                {thisMonthFiltered.length ? (
                  thisMonthFiltered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                ) : (
                  <p className='new-arrivals-empty'>No items.</p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
