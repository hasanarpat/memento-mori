'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type DateGroup = 'this-week' | 'last-week' | 'this-month';

interface Product {
  id: string;
  name: string;
  price: number;
  category: any;
  theme: string;
  badge?: string;
  isNewArrival?: boolean;
  images: any;
}

interface NewArrivalsClientProps {
  thisWeek: Product[];
  lastWeek: Product[];
  thisMonth: Product[];
  categories: { title: string; slug: string }[];
}

export default function NewArrivalsClient({
  thisWeek,
  lastWeek,
  thisMonth,
  categories,
}: NewArrivalsClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const currentMinPrice = priceRange[0];
  const currentMaxPrice = priceRange[1];
  const [newThisWeekOnly, setNewThisWeekOnly] = useState(false);
  const [openSection, setOpenSection] = useState<DateGroup | null>('this-week');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoryLabel = categoryFilter === 'all' ? 'All Worlds' : (categories.find((c) => c.slug === categoryFilter)?.title ?? 'All Worlds');

  const filterProduct = (p: Product) => {
    // Category check
    const categoriesList = Array.isArray(p.category) 
      ? p.category.map((c: any) => c.slug) 
      : [(p.category as any)?.slug].filter(Boolean);
    
    const matchCat = 
      categoryFilter === 'all' || 
      categoriesList.includes(categoryFilter);
      
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    // In this view, "newThisWeekOnly" means we only show items from the thisWeek group
    // But the groupings are already filtered by server.
    // So if newThisWeekOnly is true, we effectively hide other sections.
    return matchCat && matchPrice;
  };

  const thisWeekFiltered = thisWeek.filter(filterProduct);
  const lastWeekFiltered = lastWeek.filter(filterProduct);
  const thisMonthFiltered = thisMonth.filter(filterProduct);

  const ProductCard = ({ product }: { product: Product }) => {
    const categoryTitle = Array.isArray(product.category)
      ? product.category.map((c: any) => (typeof c === 'object' ? c.title : c)).join(' / ')
      : (product.category as any)?.title || product.theme;
    
    const imageUrl = (product.images as any)?.url;

    return (
      <Link
        href={`/product/${product.id}`}
        className='home-product-card new-arrivals-card'
      >
        <div className='home-product-image'>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover'
              unoptimized
            />
          )}
        </div>
        <div className='home-product-info'>
          <h3 className='home-product-name'>{product.name}</h3>
          <p className='home-product-category'>{categoryTitle}</p>
          <p className='home-product-price'>₺{product.price}</p>
        </div>
      </Link>
    );
  };

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
            <div className='category-dropdown-wrap' ref={categoryDropdownRef}>
              <button
                type='button'
                className='category-dropdown-trigger'
                onClick={() => setCategoryDropdownOpen((o) => !o)}
                aria-expanded={categoryDropdownOpen}
                aria-haspopup='listbox'
                aria-label='Filter by category'
              >
                <span className='category-dropdown-value'>{categoryLabel}</span>
                <ChevronDown size={14} className={categoryDropdownOpen ? 'rotate-180' : ''} />
              </button>
              {categoryDropdownOpen && (
                <div className='category-dropdown-list' role='listbox'>
                  <button
                    type='button'
                    role='option'
                    aria-selected={categoryFilter === 'all'}
                    className={`category-dropdown-item ${categoryFilter === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setCategoryFilter('all');
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    All Worlds
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      type='button'
                      role='option'
                      aria-selected={categoryFilter === c.slug}
                      className={`category-dropdown-item ${categoryFilter === c.slug ? 'active' : ''}`}
                      onClick={() => {
                        setCategoryFilter(c.slug);
                        setCategoryDropdownOpen(false);
                      }}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className='filter-section'>
            <span className='filter-label'>Price</span>
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
                  setPriceRange([val, currentMaxPrice]);
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
                  setPriceRange([currentMinPrice, val]);
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
          <label className='filter-checkbox'>
            <input
              type='checkbox'
              checked={newThisWeekOnly}
              onChange={(e) => setNewThisWeekOnly(e.target.checked)}
            />
            Show "This Week" Only
          </label>
        </aside>

        <div className='new-arrivals-main'>
          <ArrivalsGroup 
            title="This Week" 
            id="this-week" 
            products={thisWeekFiltered} 
            isOpen={openSection === 'this-week'}
            onToggle={() => setOpenSection(openSection === 'this-week' ? null : 'this-week')}
            renderCard={(p) => <ProductCard key={p.id} product={p} />}
          />

          {!newThisWeekOnly && (
            <>
              <ArrivalsGroup 
                title="Last Week" 
                id="last-week" 
                products={lastWeekFiltered} 
                isOpen={openSection === 'last-week'}
                onToggle={() => setOpenSection(openSection === 'last-week' ? null : 'last-week')}
                renderCard={(p) => <ProductCard key={p.id} product={p} />}
              />

              <ArrivalsGroup 
                title="This Month" 
                id="this-month" 
                products={thisMonthFiltered} 
                isOpen={openSection === 'this-month'}
                onToggle={() => setOpenSection(openSection === 'this-month' ? null : 'this-month')}
                renderCard={(p) => <ProductCard key={p.id} product={p} />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrivalsGroup({ 
  title, 
  id, 
  products, 
  isOpen, 
  onToggle,
  renderCard 
}: { 
  title: string; 
  id: string; 
  products: any[]; 
  isOpen: boolean; 
  onToggle: () => void;
  renderCard: (p: any) => React.ReactNode;
}) {
  return (
    <section className='new-arrivals-group'>
      <button
        type='button'
        className='new-arrivals-group-head'
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <h2 className='new-arrivals-group-title'>{title}</h2>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className='home-products-grid new-arrivals-grid'>
          {products.length ? (
            products.map(renderCard)
          ) : (
            <p className='new-arrivals-empty'>No items found in this period.</p>
          )}
        </div>
      )}
    </section>
  );
}
