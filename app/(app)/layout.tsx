import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import StoreProvider from '../lib/redux/provider';
import ShopLayout from '@/components/ShopLayout';
import JsonLd from '../components/JsonLd';
import { Toaster } from 'sonner';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  LOCALE,
  BRAND_KEYWORDS,
} from '../lib/site';
import './globals.css';
import './shop.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#0d0a0f',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: BRAND_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Dark fashion & subculture apparel`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
  category: 'fashion',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/collections?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: DEFAULT_DESCRIPTION,
  sameAs: [],
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router: fonts loaded in root layout for all pages */}
        <link
          href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800;900&family=Crimson+Text:wght@400;600;700&family=IM+Fell+DW+Pica:ital@0;1&family=Pirata+One&family=UnifrakturMaguntia&display=swap'
          rel='stylesheet'
        />
        <JsonLd data={[websiteJsonLd, organizationJsonLd]} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ShopLayout>{children}</ShopLayout>
          <Toaster
            position="top-center"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: '#1a0a1f', // deep-purple
                border: '1px solid #5c0a0a', // blood-red
                color: '#e8dcc4', // bone
                fontFamily: 'var(--font-crimson-text), serif',
              },
              className: 'font-crimson',
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
