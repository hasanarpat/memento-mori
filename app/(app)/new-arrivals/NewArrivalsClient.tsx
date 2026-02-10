'use client';

import { useState } from 'react';
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
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [newThisWeekOnly, setNewThisWeekOnly] = useState(false);
  const [openSection, setOpenSection] = useState<DateGroup | null>('this-week');

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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='filter-select'
              aria-label='Filter by category'
            >
              <option value='all'>All Worlds</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className='filter-section'>
            <span className='filter-label'>Price Cap</span>
            <div className='filter-price-display'>
              Up to ₺{priceRange[1]}
            </div>
            <input
              type='range'
              min={0}
              max={2000}
              step={50}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
              className='price-slider'
            />
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
