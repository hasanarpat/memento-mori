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
            <Link href="/" className="logo logo-umbra">
              memento mori
            </Link>
            <nav className="nav">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                HOME
              </Link>
              <Link
                href="/lookbook"
                className={`nav-link ${pathname === "/lookbook" ? "active" : ""}`}
              >
                LOOKBOOK
              </Link>
              <Link
                href="/collections"
                className={`nav-link ${pathname === "/collections" ? "active" : ""}`}
              >
                COLLECTIONS
              </Link>
              <Link
                href="/journal"
                className={`nav-link ${pathname === "/journal" ? "active" : ""}`}
              >
                JOURNAL
              </Link>
              <Link
                href="/new-arrivals"
                className={`nav-link ${pathname === "/new-arrivals" ? "active" : ""}`}
              >
                NEW ARRIVALS
              </Link>
              <Link
                href="/about"
                className={`nav-link ${pathname === "/about" ? "active" : ""}`}
              >
                ABOUT
              </Link>
              <Link
                href="/contact"
                className={`nav-link ${pathname === "/contact" ? "active" : ""}`}
              >
                CONTACT
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
              <Link href="/cart" className="icon-button" aria-label={`Cart, ${cartCount} items`}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
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
              <Link href="/new-arrivals" className="footer-link">
                New Arrivals
              </Link>
              <Link href="/journal" className="footer-link">
                Journal
              </Link>
              <Link href="/about" className="footer-link">
                About
              </Link>
              <Link href="/contact" className="footer-link">
                Contact
              </Link>
              <Link href="/size-guide" className="footer-link">
                Size Guide
              </Link>
              <Link href="/account" className="footer-link">
                Account
              </Link>
            </div>
            <div className="footer-section">
              <h3>Codex</h3>
              <Link href="/size-guide" className="footer-link">
                Sizing
              </Link>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <Link href="/contact" className="footer-link">
                Contact
              </Link>
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
