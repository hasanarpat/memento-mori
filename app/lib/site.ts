/**
 * Site-wide SEO and branding constants.
 * Set SITE_URL to your production domain for correct canonical and OG URLs.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mementomori.com";
export const SITE_NAME = "Memento Mori";
export const SITE_TAGLINE = "Umbra Aesthetica — Where Shadows Take Form";
export const DEFAULT_DESCRIPTION =
  "Dark fashion & subculture apparel. Gothic, steampunk, metal, occult, dark academia. Leather, brass, velvet, ritual objects. Handmade and limited editions.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;
export const TWITTER_HANDLE = "@mementomori";
export const LOCALE = "en_US";
export const LOCALE_ALT = "tr_TR";

export const BRAND_KEYWORDS = [
  "gothic fashion",
  "steampunk clothing",
  "dark fashion",
  "alternative fashion",
  "metal fashion",
  "occult jewelry",
  "dark academia",
  "ritual objects",
  "handmade leather",
  "memento mori",
  "subculture fashion",
  "victorian gothic",
  "industrial fashion",
  "deathrock",
];

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
