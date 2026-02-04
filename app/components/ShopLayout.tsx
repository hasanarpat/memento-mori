"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Heart, Menu, X, ChevronDown, User } from "lucide-react";
import SearchModal from "./SearchModal";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [codexOpen, setCodexOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const codexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!codexOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (codexRef.current && !codexRef.current.contains(e.target as Node)) setCodexOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [codexOpen]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
            <Link href="/" className="logo">
              <span className="logo-symbol" aria-hidden>†</span>
              Memento Mori
            </Link>

            <nav className="nav" aria-label="Main">
              <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                HOME
              </Link>
              <Link href="/collections" className={`nav-link ${pathname === "/collections" ? "active" : ""}`}>
                COLLECTIONS
              </Link>
              <Link href="/new-arrivals" className={`nav-link ${pathname === "/new-arrivals" ? "active" : ""}`}>
                NEW ARRIVALS
              </Link>
              <Link href="/journal" className={`nav-link ${pathname === "/journal" ? "active" : ""}`}>
                JOURNAL
              </Link>
              <div className="nav-dropdown" ref={codexRef}>
                <button
                  type="button"
                  className={`nav-dropdown-trigger ${codexOpen ? "open" : ""}`}
                  onClick={() => setCodexOpen((o) => !o)}
                  aria-expanded={codexOpen}
                  aria-haspopup="true"
                >
                  <span className="nav-dropdown-symbol" aria-hidden>☗</span>
                  CODEX
                  <ChevronDown size={16} />
                </button>
                <div className={`nav-dropdown-panel ${codexOpen ? "open" : ""}`}>
                  <Link href="/lookbook" onClick={() => setCodexOpen(false)}>Lookbook</Link>
                  <Link href="/worlds" onClick={() => setCodexOpen(false)}>Worlds</Link>
                  <Link href="/ritual" onClick={() => setCodexOpen(false)}>Ritual</Link>
                  <Link href="/archive" onClick={() => setCodexOpen(false)}>Archive</Link>
                </div>
              </div>
              <Link href="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
                ABOUT
              </Link>
              <Link href="/contact" className={`nav-link ${pathname === "/contact" ? "active" : ""}`}>
                CONTACT
              </Link>
            </nav>

            <div className="header-actions">
              <button
                type="button"
                className="search-trigger"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search (⌘K)"
              >
                <Search size={20} />
                <span className="search-trigger-kbd">⌘K</span>
              </button>
              <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
              <Link href="/wishlist" className="icon-button" aria-label={`Wishlist, ${wishlistIds.length} items`}>
                <Heart size={20} />
                {wishlistIds.length > 0 && <span className="cart-badge">{wishlistIds.length}</span>}
              </Link>
              <Link href="/cart" className="icon-button" aria-label={`Cart, ${cartCount} items`}>
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link href="/login" className="icon-button" aria-label="Giriş / Kayıt">
                <User size={20} />
              </Link>

              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`mobile-menu-backdrop ${mobileOpen ? "open" : ""}`}
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div className={`mobile-menu-drawer ${mobileOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu">
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">
                <span className="mobile-menu-title-symbol" aria-hidden>☗</span>
                CODEX
              </span>
              <button type="button" className="mobile-menu-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="mobile-menu-divider" aria-hidden><span>— † —</span></div>
            <nav className="mobile-menu-nav" aria-label="Mobile">
              <Link href="/" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">I</span> Home</Link>
              <Link href="/collections" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">II</span> Collections</Link>
              <Link href="/new-arrivals" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">III</span> New Arrivals</Link>
              <Link href="/lookbook" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">IV</span> Lookbook</Link>
              <Link href="/worlds" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">V</span> Worlds</Link>
              <Link href="/ritual" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">VI</span> Ritual</Link>
              <Link href="/archive" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">VII</span> Archive</Link>
              <Link href="/journal" className="mobile-menu-link" onClick={() => setMobileOpen(false)}><span className="mobile-menu-num">VIII</span> Journal</Link>
              <div className="mobile-menu-divider" aria-hidden><span>— † —</span></div>
              <Link href="/about" className="mobile-menu-link" onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/contact" className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Contact</Link>
            </nav>
            <div className="mobile-menu-actions">
              <button type="button" className="mobile-menu-action" onClick={() => { setSearchOpen(true); setMobileOpen(false); }}>
                <Search size={20} />
                Search
              </button>
              <Link href="/wishlist" className="mobile-menu-action" onClick={() => setMobileOpen(false)}>
                <Heart size={20} />
                Wishlist {wishlistIds.length > 0 && `(${wishlistIds.length})`}
              </Link>
              <Link href="/cart" className="mobile-menu-action" onClick={() => setMobileOpen(false)}>
                <ShoppingCart size={20} />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link href="/login" className="mobile-menu-action mobile-menu-action-accent" onClick={() => setMobileOpen(false)}>
                <User size={20} />
                Giriş / Kayıt
              </Link>
            </div>
            <div className="mobile-menu-divider" aria-hidden><span>— † —</span></div>
            <p className="mobile-menu-tagline">In darkness we find beauty. In leather and brass, our armor.</p>
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
