import { getPayload } from 'payload';
import configPromise from '@payload-config';
import Link from 'next/link';
import {
  ArrowRight,
  Moon,
  Cog,
  Flame,
  Sparkles,
  BookOpen,
  Box,
  Zap,
  Droplets,
} from 'lucide-react';
import { buildPageMetadata } from '../../lib/metadata';

const iconMap = {
  Moon,
  Cog,
  Flame,
  Sparkles,
  BookOpen,
  Box,
  Zap,
  Droplets,
} as const;

export const metadata = buildPageMetadata({
  title: 'Worlds',
  description:
    'Explore 8 subculture worlds: Gothic, Steampunk, Metal, Occult, Dark Academia, Industrial, Deathrock, Ritual. Dark fashion categories at Memento Mori.',
  path: '/worlds',
  keywords: [
    'gothic fashion',
    'steampunk',
    'metal fashion',
    'occult',
    'dark academia',
    'industrial fashion',
    'deathrock',
    'ritual',
    'subculture worlds',
  ],
});

export default async function WorldsPage() {
  const payload = await getPayload({ config: configPromise });

  const categoriesResult = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
  });

  const categories = categoriesResult.docs;

  return (
    <div className='worlds-page'>
      <section className='worlds-hero'>
        <h1 className='home-section-title'>Worlds</h1>
        <p className='worlds-hero-desc'>
          Each subculture has its own language. Choose your realm and wear it.
        </p>
      </section>
      <div className='worlds-grid'>
        {categories.map((category: { slug: string; icon?: string; accent?: string; title?: string; tagline?: string; shortDesc?: string }) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Moon;
          return (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className='worlds-card'
              style={{ '--world-accent': category.accent } as React.CSSProperties}
            >
              <div className='worlds-card-icon-wrap'>
                <Icon className='worlds-card-icon' size={48} />
              </div>
              <h2 className='worlds-card-name'>{category.title}</h2>
              <p className='worlds-card-tagline'>{category.tagline}</p>
              <p className='worlds-card-desc'>{category.shortDesc}</p>
              <span className='worlds-card-link'>
                Enter
                <ArrowRight size={18} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
