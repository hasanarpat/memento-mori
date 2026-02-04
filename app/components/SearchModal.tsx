"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Package, Layers } from "lucide-react";
import { products, genres } from "@/app/data/shop";
import type { Product } from "@/app/data/shop";

const RECENT_KEY = "memento-search-recent";
const MAX_RECENT = 5;
const DEBOUNCE_MS = 280;
const MAX_PRODUCTS = 8;
const MAX_GENRES = 4;

type QuickLink = { label: string; href: string; type: "quick" };
type SearchResultItem =
  | { type: "product"; data: Product }
  | { type: "genre"; data: (typeof genres)[0] }
  | QuickLink;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function scoreProduct(p: Product, q: string): number {
  const nq = normalize(q);
  const nName = normalize(p.name);
  const nCat = normalize(p.category);
  const nTheme = normalize(p.theme);
  if (nName.includes(nq)) return 100;
  if (nName.startsWith(nq)) return 90;
  if (nCat.includes(nq) || nTheme.includes(nq)) return 70;
  const words = nq.split(/\s+/).filter(Boolean);
  const nameWords = nName.split(/\s+/);
  const matchCount = words.filter((w) =>
    nameWords.some((nw) => nw.startsWith(w) || nw.includes(w))
  ).length;
  if (matchCount === words.length) return 60 + matchCount * 10;
  if (nName.includes(nq) || nCat.includes(nq)) return 50;
  return 0;
}

function scoreGenre(g: (typeof genres)[0], q: string): number {
  const nq = normalize(q);
  const nName = normalize(g.name);
  const nTag = normalize(g.tagline);
  const nSlug = normalize(g.slug);
  if (nName.includes(nq) || nSlug.includes(nq)) return 80;
  if (nTag.includes(nq)) return 60;
  return 0;
}

const QUICK_LINKS: QuickLink[] = [
  { label: "All Collections", href: "/collections", type: "quick" },
  { label: "Worlds", href: "/worlds", type: "quick" },
  { label: "New Arrivals", href: "/new-arrivals", type: "quick" },
  { label: "Ritual & Altar", href: "/ritual", type: "quick" },
  { label: "Archive", href: "/archive", type: "quick" },
];

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Debounce query for search
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, isOpen]);

  // Focus input and reset when open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setDebouncedQuery("");
      setHighlightIndex(0);
      const stored = typeof window !== "undefined" ? localStorage.getItem(RECENT_KEY) : null;
      setRecentSearches(stored ? JSON.parse(stored) : []);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Escape is handled in handleKeyDown on the input

  const scrollHighlightIntoView = useCallback((index: number) => {
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(`[id="search-result-${index}"]`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, []);

  const addRecent = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const next = [term.trim(), ...prev.filter((t) => t !== term.trim())].slice(
        0,
        MAX_RECENT
      );
      if (typeof window !== "undefined") localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const results = useMemo((): SearchResultItem[] => {
    const q = debouncedQuery;
    if (!q) {
      return [
        ...recentSearches.map((label) => ({ label, href: `/collections?q=${encodeURIComponent(label)}`, type: "quick" as const })),
        ...QUICK_LINKS.filter((l) => !recentSearches.includes(l.label)),
      ].slice(0, 8);
    }

    const quick = QUICK_LINKS.filter(
      (l) => normalize(l.label).includes(normalize(q))
    );
    const productScores = products
      .map((p) => ({ p, score: scoreProduct(p, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_PRODUCTS)
      .map((x) => ({ type: "product" as const, data: x.p }));
    const genreScores = genres
      .map((g) => ({ g, score: scoreGenre(g, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_GENRES)
      .map((x) => ({ type: "genre" as const, data: x.g }));

    return [...quick, ...genreScores, ...productScores];
  }, [debouncedQuery, recentSearches]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => {
        const next = i < results.length - 1 ? i + 1 : 0;
        scrollHighlightIntoView(next);
        return next;
      });
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => {
        const next = i > 0 ? i - 1 : results.length - 1;
        scrollHighlightIntoView(next);
        return next;
      });
      return;
    }
    if (e.key === "Enter" && results[highlightIndex]) {
      e.preventDefault();
      const item = results[highlightIndex];
      if (item.type === "quick") {
        addRecent(item.label);
        router.push(item.href);
      } else if (item.type === "genre") {
        addRecent(item.data.name);
        router.push(`/collections/${item.data.slug}`);
      } else {
        addRecent(item.data.name);
        router.push(`/product/${item.data.id}`);
      }
      onClose();
    }
  };

  const handleSelect = (item: SearchResultItem, index: number) => {
    setHighlightIndex(index);
    if (item.type === "quick") {
      addRecent(item.label);
      router.push(item.href);
    } else if (item.type === "genre") {
      addRecent(item.data.name);
      router.push(`/collections/${item.data.slug}`);
    } else {
      addRecent(item.data.name);
      router.push(`/product/${item.data.id}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="search-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="search-modal-close"
          onClick={onClose}
          aria-label="Close search"
        >
          <X size={22} />
        </button>

        <div className="search-modal-input-wrap">
          <Search className="search-modal-icon" size={22} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Seek products, worlds, collections..."
            className="search-modal-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightIndex(0);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              results[highlightIndex]
                ? `search-result-${highlightIndex}`
                : undefined
            }
          />
        </div>

        <div
          ref={listRef}
          id="search-results"
          className="search-modal-results"
          role="listbox"
          aria-label="Search results"
        >
          {results.length === 0 ? (
            <div className="search-modal-empty">
              {debouncedQuery ? (
                <>No results for &ldquo;{debouncedQuery}&rdquo;</>
              ) : (
                <>Type to search products and worlds</>
              )}
            </div>
          ) : (
            results.map((item, i) => (
              <div
                key={
                  item.type === "quick"
                    ? item.href
                    : item.type === "genre"
                      ? item.data.slug
                      : String(item.data.id)
                }
                id={`search-result-${i}`}
                role="option"
                aria-selected={i === highlightIndex}
                className={`search-modal-result ${i === highlightIndex ? "highlighted" : ""}`}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => handleSelect(item, i)}
              >
                {item.type === "quick" && (
                  <>
                    <Layers size={18} className="search-modal-result-icon" />
                    <span className="search-modal-result-label">{item.label}</span>
                    <ArrowRight size={16} className="search-modal-result-arrow" />
                  </>
                )}
                {item.type === "genre" && (
                  <>
                    <span className="search-modal-result-genre-badge">{item.data.name}</span>
                    <span className="search-modal-result-label">{item.data.tagline}</span>
                    <ArrowRight size={16} className="search-modal-result-arrow" />
                  </>
                )}
                {item.type === "product" && (
                  <>
                    <Package size={18} className="search-modal-result-icon" />
                    <div className="search-modal-result-product">
                      <span className="search-modal-result-label">{item.data.name}</span>
                      <span className="search-modal-result-meta">
                        {item.data.category} · ₺{item.data.price}
                      </span>
                    </div>
                    <ArrowRight size={16} className="search-modal-result-arrow" />
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="search-modal-kbd">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
          <span><kbd>⌘</kbd><kbd>K</kbd> open</span>
        </div>
      </div>
    </div>
  );
}
