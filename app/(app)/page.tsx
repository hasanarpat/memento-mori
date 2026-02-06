import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { products } from '../data/shop';
import NewsletterForm from '../components/NewsletterForm';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../lib/site';
import JsonLd from '../components/JsonLd';

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

export default function HomePage() {
  const newArrivals =
    products.filter((p) => p.new).length >= 8
      ? products.filter((p) => p.new)
      : [...products].slice(0, 8);

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
              <div className='hero-oval-frame'>
                <Image
                  src='/media/atlas-conan.jpg'
                  alt='Gothic Art'
                  fill
                  className='hero-frame-img'
                  priority
                />
              </div>
              <div className='hero-frame-decoration' />
            </div>
            <div className='hero-artwork-info'>
              <h2 className='artwork-title'>THE CULT OF CONAN</h2>
              <p className='artwork-subtitle'>ATLAS CHRONICLES</p>
              <div className='artwork-line' />
              <p className='artwork-artist'>MEMENTO MORI ARCHIVE</p>
            </div>
          </div>
        </div>

        <div className='hero-footer-strip'>
          <div className='strip-rolling-content'>
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <span>MEMENTO MORI</span>
                <span className='strip-symbol'>✦</span>
                <div className='strip-image-wrap'>
                  <Image
                    src='/media/English_School_-_The_Chateau_of_Blois_(showing_Latest_Phase_of_French_Gothic)_(engraving)_-_(MeisterDrucke-1649376).jpg'
                    alt='Gothic Arc'
                    width={100}
                    height={40}
                    className='strip-img'
                  />
                </div>
                <span className='strip-symbol'>✦</span>
                <span>UMBRA AESTHETICA</span>
                <span className='strip-symbol'>✦</span>
                <span>THE DARK CULT</span>
                <span className='strip-symbol'>✦</span>
              </React.Fragment>
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
          <Link href='/collections/gothic' className='home-category-card'>
            <Moon className='home-category-icon' size={48} />
            <h3 className='home-category-name'>Gothic</h3>
            <p className='home-category-desc'>
              Victorian shadows, velvet decay. Mourning elegance and timeless
              darkness.
            </p>
            <span className='home-category-link'>
              Enter
              <ArrowRight className='home-category-arrow' size={18} />
            </span>
          </Link>
          <Link href='/collections/steampunk' className='home-category-card'>
            <Zap className='home-category-icon' size={48} />
            <h3 className='home-category-name'>Steampunk</h3>
            <p className='home-category-desc'>
              Brass, gears, and clockwork. Victorian industry reimagined.
            </p>
            <span className='home-category-link'>
              Enter
              <ArrowRight className='home-category-arrow' size={18} />
            </span>
          </Link>
          <Link href='/collections/occult' className='home-category-card'>
            <Sparkles className='home-category-icon' size={48} />
            <h3 className='home-category-name'>Occult</h3>
            <p className='home-category-desc'>
              Symbols, sigils, and sacred dark. Ritual jewelry and the unseen.
            </p>
            <span className='home-category-link'>
              Enter
              <ArrowRight className='home-category-arrow' size={18} />
            </span>
          </Link>
        </div>
        <p className='home-categories-more'>
          <Link href='/worlds'>View all 8 worlds →</Link>
        </p>
      </section>

      {/* Section 3: New Arrivals */}
      <section
        className='home-new-arrivals-wrap'
        aria-labelledby='new-arrivals-heading'
      >
        <div className='home-new-arrivals-header'>
          <h2 id='new-arrivals-heading' className='home-new-arrivals-title'>
            New Arrivals
          </h2>
          <Link href='/new-arrivals' className='home-view-all'>
            View All
          </Link>
        </div>
        <div className='home-products-grid'>
          {newArrivals.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className='home-product-card'
            >
              <div className='home-product-image'>
                {product.badge && (
                  <span className='home-product-badge'>{product.badge}</span>
                )}
                {!product.badge && product.new && (
                  <span className='home-product-badge'>NEW</span>
                )}
              </div>
              <div className='home-product-info'>
                <h3 className='home-product-name'>{product.name}</h3>
                <p className='home-product-category'>{product.category}</p>
                <p className='home-product-price'>₺{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
