import React, { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import {
  Moon,
  Zap,
  Sparkles,
  ArrowRight,
  Compass,
  Sun,
  Flower,
  Ghost,
  Skull,
  Flame,
  Star,
  Quote,
  User,
  type LucideIcon,
} from 'lucide-react';
import NewsletterForm from '../components/NewsletterForm';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../lib/site';
import JsonLd from '../components/JsonLd';
import NewArrivalsSection from '../components/NewArrivalsSection';

const IconMap: Record<string, LucideIcon> = {
  moon: Moon,
  zap: Zap,
  sparkles: Sparkles,
  ghost: Ghost,
  skull: Skull,
  flame: Flame,
  compass: Compass,
  sun: Sun,
  flower: Flower,
};

export const metadata = {
  title: 'Umbra Aesthetica — Where Shadows Take Form',
  description:
    'Dark fashion & subculture apparel. Gothic, steampunk, metal, occult, dark academia. Handmade leather, brass, velvet, ritual objects. Shop Memento Mori.',
  keywords: [
    'gothic fashion',
    'dark fashion',
    'steampunk',
    'alternative clothing',
    'memento mori',
    'ritual objects',
    'handmade leather',
    'subculture fashion',
  ],
  openGraph: {
    title: 'Memento Mori — Umbra Aesthetica | Dark Fashion & Subculture',
    description:
      'Where shadows take form. Gothic, steampunk, metal, occult. Handmade and limited editions.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Memento Mori — Dark fashion',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Memento Mori — Umbra Aesthetica',
    description: 'Dark fashion & subculture. Gothic, steampunk, metal, occult.',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ],
};

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise });

  // 1. Fetch Featured/Latest Categories for the "Worlds" section
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 3,
    sort: 'title',
  });

  // 2. Fetch New Arrivals
  const newArrivalsResult = await payload.find({
    collection: 'products',
    where: {
      or: [
        { isNewArrival: { equals: true } },
        { badge: { equals: 'new' } }
      ]
    },
    limit: 8,
    page: 1,
    sort: '-createdAt',
  });

  // 3. Fetch Featured product for Hero (optional, fallback to static)
  const { docs: featuredProducts } = await payload.find({
    collection: 'products',
    where: {
      isFeatured: { equals: true },
    },
    limit: 1,
  });

  const heroProduct = featuredProducts[0];

  // 4. Testimonials to show on homepage (admin-selected)
  const { docs: testimonials } = await payload.find({
    collection: 'testimonials',
    where: { showOnHomepage: { equals: true } },
    sort: 'order',
    limit: 6,
    depth: 1,
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {/* Section 1: Hero */}
      <section className='hero' aria-label='Hero'>
        <div className='hero-grid'>
          <div className='hero-left'>
            <div className='hero-title-group'>
              <h1 className='hero-title-large'>
                <span className='hero-accent-text'>GOTHIC</span>
                <br />
                <span className='hero-main-text'>AESTHETICA</span>
              </h1>
            </div>

            <div className='hero-passages'>
              <div className='hero-passage-item'>
                <p>
                  Memento Mori — a visceral reminder that beauty resides in the
                  ephemeral and the shadows.
                </p>
              </div>
              <div className='hero-passage-item passage-secondary'>
                <p>
                  The creations forged in the Umbra style are a cross between
                  modern elegance and ancient icons.
                </p>
              </div>
            </div>

            <Link href='/collections' className='hero-discover-btn'>
              <div className='hero-discover-inner'>
                <span className='hero-discover-text'>DISCOVER</span>
                <div className='hero-discover-circle-anim' />
              </div>
            </Link>
          </div>

          <div className='hero-right'>
            <div className='hero-frame-container'>
              {/* Renaissance Symbols */}
              <Compass className='hero-symbol symbol-1' size={40} />
              <Sun className='hero-symbol symbol-2' size={32} />
              <Flower className='hero-symbol symbol-3' size={36} />

              <div className='hero-oval-frame'>
                <Image
                  src={(heroProduct?.images as any)?.url || '/atlas-conan.jpg'}
                  alt={heroProduct?.name || 'Gothic Art'}
                  fill
                  className='hero-frame-img'
                  sizes='(max-width: 768px) 85vw, 440px'
                  priority
                  unoptimized
                />
              </div>
              <div className='hero-frame-decoration' />
              <div className='hero-frame-decoration decoration-inner' />
            </div>
            <div className='hero-artwork-info'>
              <h2 className='artwork-title'>{heroProduct?.name || 'THE CULT OF CONAN'}</h2>
              <p className='artwork-subtitle'>{heroProduct?.theme?.toUpperCase() || 'ATLAS CHRONICLES'}</p>
              <p className='artwork-artist'>MEMENTO MORI ARCHIVE</p>
            </div>
          </div>
        </div>

        <div className='hero-footer-strip'>
          <div className='strip-rolling-content'>
            {[...Array(6)].map((_, i) => (
              <Fragment key={i}>
                <span>MEMENTO MORI</span>
                <div className='strip-symbol-img-wrap'>
                  <img
                    src={`/symbol.png?v=${i}`}
                    alt=''
                    className='strip-symbol-img'
                    style={{ width: '40px', height: '40px', display: 'block' }}
                  />
                </div>
                <div className='strip-image-wrap'>
                  <img
                    src={`/chateau.jpg?v=${i}`}
                    alt=''
                    className='strip-img'
                    style={{ width: '240px', height: '80px', display: 'block' }}
                  />
                </div>
                <div className='strip-symbol-img-wrap'>
                  <img
                    src={`/symbol.png?v=${i}`}
                    alt=''
                    className='strip-symbol-img'
                    style={{ width: '40px', height: '40px', display: 'block' }}
                  />
                </div>
                <span>UMBRA AESTHETICA</span>
                <div className='strip-symbol-img-wrap'>
                  <img
                    src={`/symbol.png?v=${i}`}
                    alt=''
                    className='strip-symbol-img'
                    style={{ width: '40px', height: '40px', display: 'block' }}
                  />
                </div>
                <span>THE DARK CULT</span>
                <div className='strip-symbol-img-wrap'>
                  <img
                    src={`/symbol.png?v=${i}`}
                    alt=''
                    className='strip-symbol-img'
                    style={{ width: '40px', height: '40px', display: 'block' }}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Worlds / Subcultures */}
      <section className='home-categories' aria-labelledby='explore-heading'>
        <h2 id='explore-heading' className='home-section-title'>
          Explore Our Worlds
        </h2>
        <div className='home-categories-grid'>
          {categories.map((category) => {
            const IconComponent = IconMap[category.icon || 'moon'] || Moon;
            return (
              <Link key={category.id} href={`/collections/${category.slug}`} className='home-category-card' style={{ borderColor: category.accent || 'var(--border-color)' }}>
                <IconComponent className='home-category-icon' size={48} style={{ color: category.accent }} />
                <h3 className='home-category-name'>{category.title}</h3>
                <p className='home-category-desc'>
                  {category.shortDesc || 'Discover human creativity forged in darkness.'}
                </p>
                <span className='home-category-link'>
                  Enter
                  <ArrowRight className='home-category-arrow' size={18} />
                </span>
              </Link>
            );
          })}
        </div>
        <p className='home-categories-more'>
          <Link href='/collections'>View all collections →</Link>
        </p>
      </section>

      {/* Section 3: New Arrivals (Infinite Scroll) */}
      <NewArrivalsSection 
        initialProducts={newArrivalsResult.docs as any} 
        totalPages={newArrivalsResult.totalPages || 0}
        initialPage={newArrivalsResult.page || 1}
      />

      {/* Section 3.5: Selected testimonials */}
      {testimonials.length > 0 && (
        <section className='home-testimonials' aria-labelledby='testimonials-heading'>
          <h2 id='testimonials-heading' className='home-section-title'>
            Müşteri Yorumları
          </h2>
          <div className='home-testimonials-grid'>
            {testimonials.map((t) => {
              const avatar = typeof t.authorAvatar === 'object' && t.authorAvatar && 'url' in t.authorAvatar ? (t.authorAvatar as { url?: string }).url : null;
              const product = typeof t.product === 'object' && t.product && 'slug' in t.product ? (t.product as { slug?: string; name?: string }) : null;
              return (
                <article key={t.id} className='home-testimonial-card'>
                  <Quote className='home-testimonial-quote' size={28} aria-hidden />
                  <div className='home-testimonial-stars' aria-label={`${t.rating} yıldız`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < (t.rating ?? 0) ? 'var(--accent)' : 'none'}
                        stroke='var(--accent)'
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <p className='home-testimonial-text'>{t.text}</p>
                  <div className='home-testimonial-footer'>
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt=''
                        width={48}
                        height={48}
                        className='home-testimonial-avatar'
                        unoptimized
                      />
                    ) : (
                      <div className='home-testimonial-avatar-placeholder' aria-hidden>
                        <User size={24} />
                      </div>
                    )}
                    <div className='home-testimonial-meta'>
                      <span className='home-testimonial-author'>{t.author}</span>
                      {t.date && <span className='home-testimonial-date'>{t.date}</span>}
                      {product?.slug && (
                        <Link href={`/product/${product.slug}`} className='home-testimonial-product'>
                          {product.name || 'Ürün'}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 4: Manifesto */}
      <section className='home-manifesto' aria-labelledby='manifesto-heading'>
        <div className='home-manifesto-inner'>
          <h2 id='manifesto-heading' className='home-manifesto-title'>
            The Nexus Manifesto
          </h2>
          <p>
            We believe in the fusion of past and future—where Victorian elegance
            meets industrial grit, and gothic shadows embrace metallic light.
            Every piece we forge is armor for those who refuse to blend in.
          </p>
          <p>
            Our mission is to create wearable art that tells a story: of
            rebellion, craftsmanship, and the eternal dance between darkness and
            chrome. Join the collective. Forge your future.
          </p>
          <Link href='/about' className='home-manifesto-cta'>
            Read Our Story
          </Link>
        </div>
      </section>

      {/* Section 5: Newsletter */}
      <section className='home-newsletter' aria-labelledby='newsletter-heading'>
        <h2 id='newsletter-heading' className='home-newsletter-title'>
          Join the Collective
        </h2>
        <NewsletterForm />
      </section>
    </>
  );
}
