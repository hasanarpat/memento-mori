/**
 * Shared types for product detail page and client.
 * Compatible with Payload CMS product/category/media responses (populated or id-only).
 */

export type CategoryRef =
  | string
  | { id: string; title?: string; slug?: string };

export type MediaRef = string | { url?: string };

export type ProductImageRef = MediaRef | null | undefined;

export type AdditionalImageEntry = { image?: MediaRef };

/** Lexical-style rich text from Payload */
export type RichTextChild = {
  type: string;
  text?: string;
  format?: number;
};

export type RichTextNode = {
  type: string;
  children?: RichTextChild[];
};

export type RichTextContent = {
  root?: { children?: RichTextNode[] };
} | null;

export type Product = {
  id: string;
  name: string;
  price: number;
  category: CategoryRef | CategoryRef[];
  badge: string | null;
  theme: string;
  description?: RichTextContent;
  images?: ProductImageRef;
  additionalImages?: AdditionalImageEntry[];
  stock?: number;
};

/** Get category title for display (handles populated or id-only) */
export function getCategoryTitle(
  category: Product['category'],
  fallback: string
): string {
  if (Array.isArray(category)) {
    const first = category[0];
    if (first && typeof first === 'object' && 'title' in first)
      return (first as { title?: string }).title ?? fallback;
    return fallback;
  }
  if (category && typeof category === 'object' && 'title' in category)
    return (category as { title?: string }).title ?? fallback;
  if (typeof category === 'string') return fallback;
  return fallback;
}

/** Get image URL from product.images (populated or id) */
export function getProductImageUrl(images: Product['images']): string | undefined {
  if (!images) return undefined;
  if (typeof images === 'object' && images && 'url' in images)
    return (images as { url?: string }).url;
  return undefined;
}

/** Get category id(s) for querying */
export function getCategoryIds(category: Product['category']): string[] {
  if (Array.isArray(category))
    return category
      .map((c) => (c && typeof c === 'object' && 'id' in c ? (c as { id: string }).id : null))
      .filter((id): id is string => Boolean(id));
  if (category && typeof category === 'object' && 'id' in category)
    return [(category as { id: string }).id];
  return [];
}

/** Get additional image URLs from product.additionalImages */
export function getAdditionalImageUrls(
  additionalImages: Product['additionalImages']
): (string | undefined)[] {
  if (!additionalImages || !Array.isArray(additionalImages))
    return [];
  return additionalImages.map((entry) => {
    const img = entry?.image;
    if (!img) return undefined;
    if (typeof img === 'object' && img && 'url' in img)
      return (img as { url?: string }).url;
    return undefined;
  });
}
