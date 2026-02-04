"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
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

type WishlistContextType = {
  wishlistIds: number[];
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

export function useWishlist() {
  return useContext(WishlistContext);
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const toggleWishlist = useCallback((id: number) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isInWishlist = useCallback(
    (id: number) => wishlistIds.includes(id),
    [wishlistIds]
  );

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart: () => setCartCount((c) => c + 1),
      }}
    >
    <WishlistContext.Provider
      value={{ wishlistIds, toggleWishlist, isInWishlist }}
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
                href="/worlds"
                className={`nav-link ${pathname === "/worlds" ? "active" : ""}`}
              >
                WORLDS
              </Link>
              <Link
                href="/ritual"
                className={`nav-link ${pathname === "/ritual" ? "active" : ""}`}
              >
                RITUAL
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
                href="/archive"
                className={`nav-link ${pathname === "/archive" ? "active" : ""}`}
              >
                ARCHIVE
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
              <Link href="/wishlist" className="icon-button" aria-label={`Wishlist, ${wishlistIds.length} items`}>
                <Heart size={20} />
                {wishlistIds.length > 0 && (
                  <span className="cart-badge">{wishlistIds.length}</span>
                )}
              </Link>
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
              <Link href="/worlds" className="footer-link">
                Worlds
              </Link>
              <Link href="/ritual" className="footer-link">
                Ritual
              </Link>
              <Link href="/new-arrivals" className="footer-link">
                New Arrivals
              </Link>
              <Link href="/archive" className="footer-link">
                Archive
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
              <Link href="/wishlist" className="footer-link">
                Wishlist
              </Link>
            </div>
            <div className="footer-section">
              <h3>Codex</h3>
              <Link href="/size-guide" className="footer-link">
                Sizing
              </Link>
              <Link href="/kargo" className="footer-link">
                Kargo
              </Link>
              <Link href="/iade-degisim" className="footer-link">
                İade & Değişim
              </Link>
              <Link href="/contact" className="footer-link">
                Contact
              </Link>
            </div>
            <div className="footer-section">
              <h3>Yasal</h3>
              <Link href="/kvkk" className="footer-link">
                KVKK
              </Link>
              <Link href="/gizlilik-politikasi" className="footer-link">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="footer-link">
                Kullanım Koşulları
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
    </WishlistContext.Provider>
    </CartContext.Provider>
  );
}
