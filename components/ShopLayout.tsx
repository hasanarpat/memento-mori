"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Heart } from "lucide-react";

const CartContext = createContext<{ cartCount: number; addToCart: () => void }>({
  cartCount: 0,
  addToCart: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart: () => setCartCount((c) => c + 1),
      }}
    >
      <div className="dark-cult-shop">
        <div className="grain-overlay" />
        <div className="web-decoration" />
        <div className="web-decoration web-decoration-left" />

        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              MEMENTO MORI
            </Link>
            <nav className="nav">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                Home
              </Link>
              <Link
                href="/lookbook"
                className={`nav-link ${pathname === "/lookbook" ? "active" : ""}`}
              >
                Lookbook
              </Link>
              <Link
                href="/collections"
                className={`nav-link ${pathname === "/collections" ? "active" : ""}`}
              >
                Collections
              </Link>
              <Link
                href="/journal"
                className={`nav-link ${pathname === "/journal" ? "active" : ""}`}
              >
                Journal
              </Link>
            </nav>
            <div className="header-actions">
              <div className="search-box">
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="seek..."
                  className="search-input"
                />
              </div>
              <button type="button" className="icon-button">
                <Heart size={20} />
              </button>
              <button type="button" className="icon-button">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="page-container">{children}</div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Navigate</h3>
              <Link href="/" className="footer-link">
                Home
              </Link>
              <Link href="/lookbook" className="footer-link">
                Lookbook
              </Link>
              <Link href="/collections" className="footer-link">
                Collections
              </Link>
              <Link href="/journal" className="footer-link">
                Journal
              </Link>
            </div>
            <div className="footer-section">
              <h3>Codex</h3>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <a href="#">Sizing</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-section">
              <h3>Commune</h3>
              <a href="#">Discord</a>
              <a href="#">Instagram</a>
              <a href="#">Newsletter</a>
            </div>
            <div className="footer-section">
              <h3>Manifesto</h3>
              <p>
                In darkness we find beauty. In leather and brass, our armor. In
                shadows, our truth.
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            © MMXXVI MEMENTO MORI — From dust to dust, from shadow to shadow
          </div>
        </footer>
      </div>
    </CartContext.Provider>
  );
}
