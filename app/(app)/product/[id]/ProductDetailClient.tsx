"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, ChevronDown, ChevronUp, Star, ImagePlus, X, ZoomIn, User } from "lucide-react";
import { useCart, useWishlist } from "@/components/ShopLayout";
import ImageViewer, { type ViewerSlideCaption } from "@/app/components/ImageViewer";
import { useAppSelector } from "@/app/lib/redux/hooks";

const COLORS = ["#1a0a1f", "#2b0d0d", "#3d1f1f", "#4a2c2a"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const RichText = ({ content }: { content: any }) => {
  if (!content || !content.root || !content.root.children) return null;
  
  return (
    <div className="rich-text">
      {content.root.children.map((node: any, i: number) => {
        if (node.type === 'paragraph') {
          return (
            <p key={i}>
              {node.children?.map((child: any, j: number) => {
                if (child.type === 'text') {
                  let text = child.text;
                  if (child.format & 1) text = <strong key={j}>{text}</strong>;
                  if (child.format & 2) text = <em key={j}>{text}</em>;
                  return text;
                }
                return null;
              })}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
};

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  photos: string[];
  authorAvatar?: string | null;
  age?: number | null;
  size?: string | null;
};

const DEMO_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Lilith V.",
    rating: 5,
    date: "Jan 2024",
    text: "Stunning craftsmanship. The leather ages beautifully. Exactly the dark aesthetic I was looking for.",
    photos: ["https://picsum.photos/400/400?random=10", "https://picsum.photos/400/400?random=11"],
    authorAvatar: "https://picsum.photos/200/200?random=avatar1",
    age: 28,
    size: "S",
  },
  {
    id: "2",
    author: "Corvus",
    rating: 5,
    date: "Dec 2023",
    text: "Worth every penny. Wore it to a ritual and got so many compliments.",
    photos: ["https://picsum.photos/400/400?random=12"],
    age: 34,
    size: "M",
  },
  {
    id: "3",
    author: "M.",
    rating: 4,
    date: "Dec 2023",
    text: "Sizing was spot on. Only minor note: brass could be slightly heavier. Still love it.",
    photos: [],
    authorAvatar: "https://picsum.photos/200/200?random=avatar3",
    age: 22,
    size: "L",
  },
];

type Product = {
  id: string;
  name: string;
  price: number;
  category: any;
  badge: string | null;
  theme: string;
  description?: any;
  images: any;
  additionalImages?: { image: any }[];
  stock?: number;
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
  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerCaptions, setViewerCaptions] = useState<(ViewerSlideCaption | null)[] | null>(null);
  const [viewerIsProductGallery, setViewerIsProductGallery] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const allReviewSlides = useMemo(() => {
    return reviews.flatMap((r) =>
      r.photos.map((src) => ({
        src,
        reviewText: r.text,
        reviewAuthor: r.author,
        reviewRating: r.rating,
        reviewAuthorAvatar: r.authorAvatar ?? null,
        reviewAge: r.age ?? null,
        reviewSize: r.size ?? null,
      }))
    );
  }, [reviews]);

  const getReviewPhotoGlobalIndex = useCallback(
    (reviewIndex: number, photoIndex: number) => {
      let idx = 0;
      for (let i = 0; i < reviewIndex; i++) idx += reviews[i].photos.length;
      return idx + photoIndex;
    },
    [reviews]
  );
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [reviewPhotoFiles, setReviewPhotoFiles] = useState<File[]>([]);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const openReviewPhotoViewer = useCallback(
    (reviewIndex: number, photoIndex: number) => {
      if (allReviewSlides.length === 0) return;
      const globalIndex = getReviewPhotoGlobalIndex(reviewIndex, photoIndex);
      setViewerImages(allReviewSlides.map((s) => s.src));
      setViewerCaptions(
        allReviewSlides.map((s) => ({
          reviewText: s.reviewText,
          reviewAuthor: s.reviewAuthor,
          reviewRating: s.reviewRating,
          reviewAuthorAvatar: s.reviewAuthorAvatar,
          reviewAge: s.reviewAge,
          reviewSize: s.reviewSize,
        }))
      );
      setViewerIndex(globalIndex);
      setViewerIsProductGallery(false);
      setViewerOpen(true);
    },
    [allReviewSlides, getReviewPhotoGlobalIndex]
  );

  const allImages = [
    product.images?.url,
    ...(product.additionalImages?.map((img: any) => img.image?.url).filter(Boolean) || []),
  ].filter(Boolean);

  const openProductGalleryViewer = useCallback(() => {
    setViewerImages(allImages as string[]);
    setViewerIndex(mainImage);
    setViewerCaptions(null);
    setViewerIsProductGallery(true);
    setViewerOpen(true);
  }, [mainImage, allImages]);

  const handleViewerNavigate = useCallback((index: number) => {
    setViewerIndex(index);
    if (viewerIsProductGallery) setMainImage(index);
  }, [viewerIsProductGallery]);

  const handleReviewPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + reviewPhotoFiles.length > 5) return;
    setReviewPhotoFiles((prev) => [...prev, ...files].slice(0, 5));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setReviewPhotos((prev) => [...prev, reader.result as string].slice(0, 5));
      reader.readAsDataURL(file);
    });
  };
  const removeReviewPhoto = (i: number) => {
    setReviewPhotoFiles((prev) => prev.filter((_, j) => j !== i));
    setReviewPhotos((prev) => prev.filter((_, j) => j !== i));
  };
  const submitReview = () => {
    if (!reviewRating || !reviewText.trim()) return;
    setReviews((prev) => [
      {
        id: String(Date.now()),
        author: "You",
        rating: reviewRating,
        date: "Just now",
        text: reviewText.trim(),
        photos: [...reviewPhotos],
      },
      ...prev,
    ]);
    setReviewRating(0);
    setReviewText("");
    setReviewPhotos([]);
    setReviewPhotoFiles([]);
    setReviewFormOpen(false);
  };

  const stock = product.stock || 0;
  const inStock = stock > 0;
  const lowStock = stock > 0 && stock <= 3;

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
  ];

  return (
    <div className="product-detail-wrap">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/collections">Collections</Link>
        <span aria-hidden="true"> / </span>
        <span>
          {Array.isArray(product.category)
            ? product.category.map((c: any) => (typeof c === 'object' ? c.title : c)).join(' / ')
            : (product.category as any)?.title || (typeof product.category === 'string' ? product.category : product.theme)}
        </span>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="product-detail-grid">
        <div className="product-detail-gallery">
          <button
            type="button"
            className="product-detail-main-image-wrap"
            onClick={openProductGalleryViewer}
            aria-label="Open image viewer to zoom and browse images"
          >
            <div
              className="product-detail-main-image"
              role="img"
              aria-label={`Product view ${mainImage + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images?.url || "https://picsum.photos/800/800?random=1"}
                alt={`${product.name} view ${mainImage + 1}`}
                className="product-detail-main-img"
              />
            </div>
            <span className="product-detail-main-image-zoom-hint">
              <ZoomIn size={24} aria-hidden />
              <span>Click to zoom</span>
            </span>
          </button>
          <div className="product-detail-thumbs">
            {allImages.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`product-detail-thumb ${mainImage === i ? "active" : ""}`}
                onClick={() => setMainImage(i)}
                aria-label={`View image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img as string}
                  alt=""
                  className="product-detail-thumb-img"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <span className="product-detail-category-badge">
            {Array.isArray(product.category)
              ? product.category.map((c: any) => (typeof c === 'object' ? c.title : c)).join(' / ')
              : (product.category as any)?.title || (typeof product.category === 'string' ? product.category : product.theme)}
          </span>
          <p className="product-detail-price">₺{product.price}</p>
          <div className="product-detail-rating">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={18} fill="var(--accent)" color="var(--accent)" />
            ))}
            <span className="product-detail-reviews">({reviews.length} reviews)</span>
          </div>
          <div className="product-detail-desc">
            {product.description ? (
              <RichText content={product.description} />
            ) : (
              <p>A statement piece that blends gothic elegance with industrial edge.</p>
            )}
          </div>

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
                addToCart({
                  id: String(product.id),
                  product: {
                    id: String(product.id),
                    name: product.name,
                    slug: String(product.id),
                    price: product.price,
                    description: '',
                  },
                  quantity: qty,
                  price: product.price,
                });
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

          <section className="product-reviews" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="product-reviews-title">
              Reviews ({reviews.length})
            </h2>
            <ul className="product-reviews-list">
              {reviews.map((r, reviewIndex) => (
                <li key={r.id} className="product-review-item">
                  <div className="product-review-header">
                    <div className="product-review-author-wrap">
                      <div className="product-review-avatar" aria-hidden>
                        {r.authorAvatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={r.authorAvatar} alt="" />
                        ) : (
                          <User size={20} className="product-review-avatar-icon" />
                        )}
                      </div>
                      <span className="product-review-author">{r.author}</span>
                    </div>
                    <span className="product-review-date">{r.date}</span>
                  </div>
                  {(r.age != null || r.size != null) && (
                    <div className="product-review-details">
                      {r.age != null && `${r.age} yaş`}
                      {r.age != null && r.size != null && " · "}
                      {r.size != null && `${r.size} beden`}
                    </div>
                  )}
                  <div className="product-review-stars">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i <= r.rating ? "var(--accent)" : "none"}
                        color="var(--accent)"
                      />
                    ))}
                  </div>
                  <p className="product-review-text">{r.text}</p>
                  {r.photos.length > 0 && (
                    <div className="product-review-photos">
                      {r.photos.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          className="product-review-photo-thumb"
                          onClick={() => openReviewPhotoViewer(reviewIndex, i)}
                          aria-label={`View photo ${i + 1}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {isAuthenticated && (
              <div className="product-review-form-wrap">
                {!reviewFormOpen ? (
                  <button
                    type="button"
                    className="product-review-write-btn"
                    onClick={() => setReviewFormOpen(true)}
                    aria-expanded="false"
                    aria-controls="product-review-form"
                  >
                    Write a review
                  </button>
                ) : (
                  <div id="product-review-form" className="product-review-form" role="region" aria-labelledby="review-form-heading">
                    <h3 id="review-form-heading" className="product-review-form-title">Write a review</h3>
                    <div className="product-review-form-rating">
                      <span className="product-review-form-label">Rating</span>
                      <div className="product-review-stars product-review-form-stars">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(i)}
                            aria-label={`${i} star`}
                            aria-pressed={reviewRating === i}
                          >
                            <Star
                              size={24}
                              fill={i <= reviewRating ? "var(--accent)" : "none"}
                              color="var(--accent)"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="product-review-form-label">
                      Your review
                      <textarea
                        className="product-review-form-textarea"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        placeholder="Share your experience..."
                      />
                    </label>
                    <div className="product-review-form-photos">
                      <span className="product-review-form-label">Photos (optional, max 5)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleReviewPhotoChange}
                        className="product-review-form-file"
                        id="review-photos"
                      />
                      <label htmlFor="review-photos" className="product-review-form-upload">
                        <ImagePlus size={20} />
                        Add photos
                      </label>
                      {reviewPhotos.length > 0 && (
                        <div className="product-review-form-preview">
                          {reviewPhotos.map((src, i) => (
                            <div key={i} className="product-review-form-preview-item">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt="" />
                              <button
                                type="button"
                                onClick={() => removeReviewPhoto(i)}
                                className="product-review-form-preview-remove"
                                aria-label="Remove photo"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="product-review-form-actions">
                      <button
                        type="button"
                        className="product-detail-btn-ghost"
                        onClick={() => setReviewFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="product-detail-btn-primary"
                        onClick={submitReview}
                        disabled={!reviewRating || !reviewText.trim()}
                      >
                        Submit review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {viewerOpen && viewerImages.length > 0 && (
        <ImageViewer
          images={viewerImages}
          currentIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
          onNavigate={handleViewerNavigate}
          captions={viewerCaptions ?? undefined}
        />
      )}

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
                  <p className="home-product-category">
                    {Array.isArray(p.category)
                      ? p.category.map((c: any) => (typeof c === 'object' ? c.title : c)).join(' / ')
                      : (p.category as any)?.title || (typeof p.category === 'string' ? p.category : p.theme)}
                  </p>
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
