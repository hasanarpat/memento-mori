'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Heart, Menu, X } from 'lucide-react';
import SearchModal from '@/app/components/SearchModal';

const CartContext = createContext<{
  cartCount: number;
  addToCart: () => void;
}>({
  cartCount: 0,
  addToCart: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

const WishlistContext = createContext<{
  wishlistIds: string[];
  toggleWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
}>({
  wishlistIds: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

export function useWishlist() {
  return useContext(WishlistContext);
}

const WISHLIST_KEY = 'memento-wishlist';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [codexOpen, setCodexOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const codexRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We use a small delay or check mount to avoid the "cascading renders" warning
    // when setting state immediately on mount in a complex layout.
    const syncWishlist = () => {
      try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as string[];
          if (Array.isArray(parsed)) setWishlistIds(parsed);
        }
      } catch {
        // ignore
      }
    };

    // Using requestAnimationFrame to ensure it happens after the first paint
    // and doesn't block the initial render flow.
    requestAnimationFrame(syncWishlist);
  }, []);

  useEffect(() => {
    if (wishlistIds.length > 0) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds]);

  const toggleWishlist = useCallback((id: string | number) => {
    const sid = String(id);
    setWishlistIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid],
    );
  }, []);

  const isInWishlist = useCallback(
    (id: string | number) => wishlistIds.includes(String(id)),
    [wishlistIds],
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (codexRef.current && !codexRef.current.contains(e.target as Node)) {
        setCodexOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
      if (
        exploreRef.current &&
        !exploreRef.current.contains(e.target as Node)
      ) {
        setExploreOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const hideFooter = pathname === '/login';

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
        <div className='dark-cult-shop'>
          <div className='grain-overlay' />
          <div className='web-decoration' />
          <div className='web-decoration web-decoration-left' />

          <header className='header'>
            <div className='header-content'>
              <Link href='/' className='logo'>
                MEMENTO MORI
              </Link>
              <nav className='nav'>
                <Link
                  href='/'
                  className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                >
                  HOME
                </Link>

                {/* SHOP DROPDOWN */}
                <div className='nav-dropdown-wrapper' ref={shopRef}>
                  <button
                    type='button'
                    className={`nav-link nav-link-button ${shopOpen ? 'active' : ''}`}
                    aria-expanded={shopOpen}
                  >
                    SHOP
                  </button>
                  <div className='nav-dropdown-content'>
                    <Link
                      href='/collections'
                      onClick={() => setShopOpen(false)}
                    >
                      Collections
                    </Link>
                    <Link
                      href='/new-arrivals'
                      onClick={() => setShopOpen(false)}
                    >
                      New Arrivals
                    </Link>
                  </div>
                </div>

                {/* EXPLORE DROPDOWN */}
                <div className='nav-dropdown-wrapper' ref={exploreRef}>
                  <button
                    type='button'
                    className={`nav-link nav-link-button ${exploreOpen ? 'active' : ''}`}
                    aria-expanded={exploreOpen}
                  >
                    EXPLORE
                  </button>
                  <div className='nav-dropdown-content'>
                    <Link href='/journal' onClick={() => setExploreOpen(false)}>
                      Journal
                    </Link>
                    <Link href='/about' onClick={() => setExploreOpen(false)}>
                      About
                    </Link>
                  </div>
                </div>

                {/* CODEX DROPDOWN */}
                <div className='nav-dropdown-wrapper' ref={codexRef}>
                  <button
                    type='button'
                    className={`nav-link nav-link-button ${codexOpen ? 'active' : ''}`}
                    aria-expanded={codexOpen}
                  >
                    CODEX
                  </button>
                  <div className='nav-dropdown-content'>
                    <Link
                      href='/size-guide'
                      onClick={() => setCodexOpen(false)}
                    >
                      Sizing
                    </Link>
                    <Link href='/kvkk' onClick={() => setCodexOpen(false)}>
                      KVKK
                    </Link>
                    <Link
                      href='/gizlilik-politikasi'
                      onClick={() => setCodexOpen(false)}
                    >
                      Gizlilik
                    </Link>
                    <Link href='/contact' onClick={() => setCodexOpen(false)}>
                      Contact
                    </Link>
                  </div>
                </div>
              </nav>
              <div className='header-actions'>
                <button
                  type='button'
                  className='search-trigger'
                  onClick={() => setSearchOpen(true)}
                  aria-label='Search'
                >
                  <Search size={18} />
                  <span className='search-trigger-text'>seek...</span>
                </button>
                <Link
                  href='/wishlist'
                  className='icon-button'
                  aria-label='Wishlist'
                >
                  <Heart size={20} />
                  {wishlistIds.length > 0 && (
                    <span className='cart-badge'>{wishlistIds.length}</span>
                  )}
                </Link>
                <Link href='/cart' className='icon-button' aria-label='Cart'>
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className='cart-badge'>{cartCount}</span>
                  )}
                </Link>
                <Link href='/login' className='nav-link header-login'>
                  LOGIN
                </Link>
                <button
                  type='button'
                  className='mobile-menu-btn'
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            <div
              className={`mobile-menu-backdrop ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <div className={`mobile-menu-drawer ${mobileOpen ? 'open' : ''}`}>
              <div className='mobile-menu-header'>
                <span className='mobile-menu-title'>
                  <span className='mobile-menu-title-symbol'>☠</span>
                  MENU
                </span>
                <button
                  type='button'
                  className='mobile-menu-close'
                  onClick={() => setMobileOpen(false)}
                  aria-label='Close menu'
                >
                  <X size={22} />
                </button>
              </div>
              <div className='mobile-menu-divider'>
                <span>NAVIGATE</span>
              </div>
              <nav className='mobile-menu-nav'>
                <Link
                  href='/'
                  className='mobile-menu-link'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-menu-num'>I</span> HOME
                </Link>
                <Link
                  href='/collections'
                  className='mobile-menu-link'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-menu-num'>II</span> COLLECTIONS
                </Link>
                <Link
                  href='/new-arrivals'
                  className='mobile-menu-link'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-menu-num'>III</span> NEW ARRIVALS
                </Link>
                <Link
                  href='/journal'
                  className='mobile-menu-link'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-menu-num'>IV</span> JOURNAL
                </Link>
                <Link
                  href='/about'
                  className='mobile-menu-link'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-menu-num'>V</span> ABOUT
                </Link>
                <Link
                  href='/contact'
                  className='mobile-menu-link'
                  onClick={() => setMobileOpen(false)}
                >
                  <span className='mobile-menu-num'>VI</span> CONTACT
                </Link>
              </nav>
              <div className='mobile-menu-actions'>
                <Link
                  href='/wishlist'
                  className='mobile-menu-action'
                  onClick={() => setMobileOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  href='/cart'
                  className='mobile-menu-action mobile-menu-action-accent'
                  onClick={() => setMobileOpen(false)}
                >
                  Cart {cartCount > 0 ? `(${cartCount})` : ''}
                </Link>
                <Link
                  href='/login'
                  className='mobile-menu-action'
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
              </div>
              <p className='mobile-menu-tagline'>In darkness we find beauty.</p>
            </div>
          </header>

          <SearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />

          <div className='page-container'>{children}</div>

          {!hideFooter && (
            <footer className='footer'>
              <div className='footer-content'>
                <div className='footer-section'>
                  <h3>Navigate</h3>
                  <Link href='/' className='footer-link'>
                    Home
                  </Link>
                  <Link href='/lookbook' className='footer-link'>
                    Lookbook
                  </Link>
                  <Link href='/collections' className='footer-link'>
                    Collections
                  </Link>
                  <Link href='/journal' className='footer-link'>
                    Journal
                  </Link>
                </div>
                <div className='footer-section'>
                  <h3>Codex</h3>
                  <Link href='/kvkk' className='footer-link'>
                    KVKK
                  </Link>
                  <Link href='/gizlilik-politikasi' className='footer-link'>
                    Gizlilik
                  </Link>
                  <Link href='/size-guide' className='footer-link'>
                    Sizing
                  </Link>
                  <Link href='/contact' className='footer-link'>
                    Contact
                  </Link>
                </div>
                <div className='footer-section'>
                  <h3>Commune</h3>
                  <a href='#' className='footer-link'>
                    Discord
                  </a>
                  <a href='#' className='footer-link'>
                    Instagram
                  </a>
                  <a href='#' className='footer-link'>
                    Newsletter
                  </a>
                </div>
                <div className='footer-section'>
                  <h3>Manifesto</h3>
                  <p>
                    In darkness we find beauty. In leather and brass, our armor.
                    In shadows, our truth.
                  </p>
                </div>
              </div>
              <div className='footer-bottom'>
                © MMXXVI MEMENTO MORI — From dust to dust, from shadow to shadow
              </div>
            </footer>
          )}
        </div>
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
}
