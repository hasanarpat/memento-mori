"use client";

import { useState } from "react";
import { Heart, Eye, Guitar, Skull } from "lucide-react";
import { products } from "../data/shop";
import { useCart } from "../../components/ShopLayout";

export default function CollectionsPage() {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("new");
  const { addToCart } = useCart();

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === "all" ||
      product.category.includes(categoryFilter);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "new") return (b.new ? 1 : 0) - (a.new ? 1 : 0);
    return 0;
  });

  return (
    <div className="collections-page">
      <aside className="filters-sidebar">
        <div className="filter-section">
          <h3 className="filter-title">Category</h3>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={categoryFilter === "all"}
              onChange={() => setCategoryFilter("all")}
            />
            All Categories
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={categoryFilter === "Gothic"}
              onChange={() => setCategoryFilter("Gothic")}
            />
            Gothic
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={categoryFilter === "Metal"}
              onChange={() => setCategoryFilter("Metal")}
            />
            Metal
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={categoryFilter === "Steampunk"}
              onChange={() => setCategoryFilter("Steampunk")}
            />
            Steampunk
          </label>
        </div>
        <div className="filter-section">
          <h3 className="filter-title">Price Range</h3>
          <div
            style={{
              fontFamily: "'Crimson Text', serif",
              color: "var(--aged-silver)",
              marginBottom: "0.5rem",
            }}
          >
            ${priceRange[0]} - ${priceRange[1]}
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([0, parseInt(e.target.value, 10)])
            }
            className="price-slider"
            style={{ width: "100%", accentColor: "var(--blood-red)" }}
          />
        </div>
        <button
          type="button"
          className="clear-filters"
          onClick={() => {
            setCategoryFilter("all");
            setPriceRange([0, 1000]);
          }}
        >
          Clear All Filters
        </button>
      </aside>
      <div className="collections-main">
        <div className="collections-toolbar">
          <div>
            <div className="breadcrumb">Home / Collections</div>
            <div className="product-count" style={{ marginTop: "0.5rem" }}>
              Showing {sortedProducts.length} of {products.length} artifacts
            </div>
          </div>
          <select
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="new">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <div className="product-placeholder">
                  {product.theme === "metal" && <Guitar />}
                  {product.theme === "gothic" && <Eye />}
                  {product.theme === "steampunk" && <Skull />}
                </div>
                {product.badge && (
                  <div
                    className={`product-badge ${product.badge.toLowerCase()}`}
                  >
                    {product.badge}
                  </div>
                )}
                <div className="product-actions">
                  <button
                    type="button"
                    className={`action-button ${likedProducts.has(product.id) ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(product.id);
                    }}
                  >
                    <Heart
                      size={18}
                      fill={
                        likedProducts.has(product.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                  <button type="button" className="action-button">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-footer">
                  <div className="product-price">${product.price}</div>
                  <button
                    type="button"
                    className="add-to-cart"
                    onClick={() => addToCart()}
                  >
                    Acquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
