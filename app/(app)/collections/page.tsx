'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Eye,
  Skull,
  Moon,
  Cog,
  Flame,
  Sparkles,
  BookOpen,
  Box,
  Zap,
  Droplets,
  ChevronDown,
} from 'lucide-react';
import { products, genres } from '../../data/shop';
import { useCart, useWishlist } from '../../components/ShopLayout';

const themeIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  gothic: Moon,
  steampunk: Cog,
  metal: Flame,
  occult: Sparkles,
  'dark-academia': BookOpen,
  industrial: Box,
  deathrock: Zap,
  ritual: Droplets,
};

const productTypeLabels: Record<string, string> = {
  apparel: 'Apparel',
  outerwear: 'Outerwear',
  jewelry: 'Jewelry',
  accessories: 'Accessories',
  footwear: 'Footwear',
  ritual: 'Ritual',
  harness: 'Harness',
};

const sortOptions = [
  { value: 'new', label: 'New First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function CollectionsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('new');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    world: true,
    type: false,
    price: false,
  });

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Close sort dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === 'all' || product.theme === categoryFilter;
    const matchesType =
      typeFilter === 'all' || product.productType === typeFilter;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesType && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'new') return (b.new ? 1 : 0) - (a.new ? 1 : 0);
    return 0;
  });

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label;

  return (
    <div className='collections-page'>
      <aside className='filters-sidebar'>
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
                checked={categoryFilter === 'all'}
                onChange={() => setCategoryFilter('all')}
              />
              <span className='option-label'>All Worlds</span>
            </label>
            {genres.map((g) => (
              <label key={g.slug} className='filter-option-minimal'>
                <input
                  type='radio'
                  name='genre'
                  checked={categoryFilter === g.slug}
                  onChange={() => setCategoryFilter(g.slug)}
                />
                <span className='option-label'>{g.name}</span>
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
                checked={typeFilter === 'all'}
                onChange={() => setTypeFilter('all')}
              />
              <span className='option-label'>All Types</span>
            </label>
            {Object.entries(productTypeLabels).map(([value, label]) => (
              <label key={value} className='filter-option-minimal'>
                <input
                  type='radio'
                  name='type'
                  checked={typeFilter === value}
                  onChange={() => setTypeFilter(value)}
                />
                <span className='option-label'>{label}</span>
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
              <div className='price-input-wrap'>
                <span className='price-currency'>₺</span>
                <input
                  type='number'
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      parseInt(e.target.value, 10) || 0,
                      priceRange[1],
                    ])
                  }
                />
              </div>
              <span className='price-separator'>-</span>
              <div className='price-input-wrap'>
                <span className='price-currency'>₺</span>
                <input
                  type='number'
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value, 10) || 0,
                    ])
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar-footer'>
          <Link href='/worlds' className='collections-worlds-link'>
            Explore all Worlds →
          </Link>
          <button
            type='button'
            className='clear-filters-minimal'
            onClick={() => {
              setCategoryFilter('all');
              setTypeFilter('all');
              setPriceRange([0, 1000]);
            }}
          >
            Reset
          </button>
        </div>
      </aside>

      <div className='collections-main'>
        <div className='collections-toolbar'>
          <div>
            <div className='breadcrumb'>Home / Collections</div>
            <div className='product-count' style={{ marginTop: '0.5rem' }}>
              {sortedProducts.length} of {products.length} artifacts
            </div>
          </div>

          {/* CUSTOM AESTHETIC DROPDOWN */}
          <div className='custom-dropdown-wrap' ref={sortRef}>
            <button
              className='custom-dropdown-trigger'
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <span className='trigger-label'>Sort:</span>
              <span className='trigger-value'>{currentSortLabel}</span>
              <ChevronDown
                size={14}
                className={isSortOpen ? 'rotate-180' : ''}
              />
            </button>
            {isSortOpen && (
              <div className='custom-dropdown-list'>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`custom-dropdown-item ${sortBy === opt.value ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsSortOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='products-grid'>
          {sortedProducts.map((product) => {
            const Icon = themeIcons[product.theme] ?? Skull;
            const inWishlist = isInWishlist(product.id);
            return (
              <div key={product.id} className='product-card'>
                <div className='product-image'>
                  <div className='product-placeholder'>
                    <Icon size={36} />
                  </div>
                  {product.badge && (
                    <div
                      className={`product-badge ${product.badge.toLowerCase().replace(/\s/g, '-')}`}
                    >
                      {product.badge}
                    </div>
                  )}
                  <div className='product-actions'>
                    <button
                      type='button'
                      className={`action-button ${inWishlist ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                    >
                      <Heart
                        size={18}
                        fill={inWishlist ? 'currentColor' : 'none'}
                      />
                    </button>
                    <Link
                      href={`/product/${product.id}`}
                      className='action-button'
                      aria-label='View product'
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
                <div className='product-info'>
                  <div className='product-category'>{product.category}</div>
                  <h3 className='product-name'>
                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className='product-footer'>
                    <div className='product-price'>₺{product.price}</div>
                    <button
                      type='button'
                      className='add-to-cart'
                      onClick={() => addToCart()}
                    >
                      Acquire
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
