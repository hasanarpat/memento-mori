import type { Metadata } from "next";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "./site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

/**
 * Builds full metadata with Open Graph, Twitter Card, and canonical for a page.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
