"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useCart, useWishlist } from "@/app/components/ShopLayout";

const PLACEHOLDER_IMAGES = 4;
const COLORS = ["#1a0a1f", "#2b0d0d", "#3d1f1f", "#4a2c2a"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  badge: string | null;
  theme: string;
  new: boolean;
};

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [mainImage, setMainImage] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState<string | null>("M");
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const stock = 12;
  const inStock = stock > 0;
  const lowStock = stock <= 3;

  const accordions = [
    {
      id: "details",
      title: "Product Details",
      content:
        "Materials: Premium leather, brass hardware, cotton lining. Hand-finished. Spot clean only. Store in a cool, dry place.",
    },
    {
      id: "size",
      title: "Size Guide",
      content: "Refer to our size guide for measurements. Link: ",
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content:
        "Free shipping on orders over ₺500. Standard delivery 5-7 business days. 30-day return policy for unworn items.",
    },
    {
      id: "reviews",
      title: "Reviews",
      content: "24 reviews. Average rating 4.8/5.",
    },
  ];

  return (
    <div className="product-detail-wrap">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/collections">Collections</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.category}</span>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="product-detail-grid">
        <div className="product-detail-gallery">
          <div
            className="product-detail-main-image"
            style={{ aspectRatio: "1", background: "rgba(26,10,31,0.6)", border: "2px solid rgba(139,115,85,0.3)" }}
            role="img"
            aria-label={`Product view ${mainImage + 1}`}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: COLORS[mainImage % COLORS.length],
                opacity: 0.8,
              }}
            />
          </div>
          <div className="product-detail-thumbs">
            {Array.from({ length: PLACEHOLDER_IMAGES }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`product-detail-thumb ${mainImage === i ? "active" : ""}`}
                onClick={() => setMainImage(i)}
                style={{
                  aspectRatio: "1",
                  background: COLORS[i % COLORS.length],
                  border: mainImage === i ? "2px solid var(--accent)" : "2px solid rgba(139,115,85,0.3)",
                }}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <span className="product-detail-category-badge">{product.category}</span>
          <p className="product-detail-price">₺{product.price}</p>
          <div className="product-detail-rating">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={18} fill="var(--accent)" color="var(--accent)" />
            ))}
            <span className="product-detail-reviews">(24 reviews)</span>
          </div>
          <p className="product-detail-desc">
            A statement piece that blends gothic elegance with industrial edge.
            Handcrafted with premium materials for those who dare to stand out.
          </p>

          <div className="product-detail-variants">
            <div className="product-detail-variant">
              <span className="product-detail-variant-label">Color</span>
              <div className="product-detail-color-swatches">
                {COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`product-detail-swatch ${color === i ? "active" : ""}`}
                    style={{ background: c }}
                    onClick={() => setColor(i)}
                    aria-label={`Color ${i + 1}`}
                    aria-pressed={color === i}
                  />
                ))}
              </div>
            </div>
            <div className="product-detail-variant">
              <span className="product-detail-variant-label">Size</span>
              <div className="product-detail-size-btns">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`product-detail-size-btn ${size === s ? "active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="product-detail-stock">
                {inStock ? (
                  lowStock ? (
                    <span style={{ color: "var(--rust)" }}>Low Stock</span>
                  ) : (
                    <span style={{ color: "#4ade80" }}>In Stock</span>
                  )
                ) : (
                  <span>Out of Stock</span>
                )}
              </p>
            </div>
          </div>

          <div className="product-detail-qty">
            <span className="product-detail-variant-label">Quantity</span>
            <div className="product-detail-qty-controls">
              <button
                type="button"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min={1}
                max={stock}
                value={qty}
                onChange={(e) =>
                  setQty(Math.min(stock, Math.max(1, Number(e.target.value) || 1)))
                }
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={() => setQty((n) => Math.min(stock, n + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="product-detail-actions">
            <button
              type="button"
              className="product-detail-btn-primary"
              onClick={() => {
                for (let i = 0; i < qty; i++) addToCart();
              }}
            >
              Add to Cart
            </button>
            <Link href="/checkout" className="product-detail-btn-outline">
              Buy Now
            </Link>
            <button
              type="button"
              className={`product-detail-btn-ghost ${inWishlist ? "in-wishlist" : ""}`}
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={inWishlist}
            >
              <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <div className="product-detail-accordions">
            {accordions.map((acc) => (
              <div key={acc.id} className="product-detail-accordion">
                <button
                  type="button"
                  className="product-detail-accordion-btn"
                  onClick={() =>
                    setOpenAccordion(openAccordion === acc.id ? null : acc.id)
                  }
                  aria-expanded={openAccordion === acc.id}
                >
                  {acc.title}
                  {openAccordion === acc.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openAccordion === acc.id && (
                  <div className="product-detail-accordion-content">
                    {acc.content}
                    {acc.id === "size" && (
                      <Link href="/size-guide" className="product-detail-size-link">
                        View size guide
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="product-detail-related" aria-labelledby="related-heading">
          <h2 id="related-heading" className="home-section-title">
            You May Also Like
          </h2>
          <div className="product-detail-related-scroll">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="home-product-card"
                style={{ minWidth: "240px" }}
              >
                <div className="home-product-image" />
                <div className="home-product-info">
                  <h3 className="home-product-name">{p.name}</h3>
                  <p className="home-product-category">{p.category}</p>
                  <p className="home-product-price">₺{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
