'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Skull, User, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../../data/shop';

export default function JournalPage() {
  const [blogCategory, setBlogCategory] = useState('all');

  const filteredBlog = blogPosts.filter(
    (post) => blogCategory === 'all' || post.category === blogCategory,
  );
  const featuredPost = blogPosts.find((p) => p.featured);

  return (
    <div className='blog-page'>
      <h2 className='section-title'>The Grimoire</h2>
      {featuredPost && (
        <Link
          href={`/journal/${featuredPost.slug}`}
          className='blog-featured-link'
        >
          <div className='blog-featured'>
            <div className='blog-featured-content'>
              <span className='blog-category-badge'>
                {featuredPost.category}
              </span>
              <h2 className='blog-title'>{featuredPost.title}</h2>
              <div className='blog-meta'>
                <div className='blog-meta-item'>
                  <User size={16} />
                  {featuredPost.author}
                </div>
                <div className='blog-meta-item'>
                  <Calendar size={16} />
                  {featuredPost.date}
                </div>
                <div className='blog-meta-item'>
                  <Clock size={16} />
                  {featuredPost.readTime}
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
      <div className='blog-categories'>
        <button
          type='button'
          className={`blog-category-filter ${blogCategory === 'all' ? 'active' : ''}`}
          onClick={() => setBlogCategory('all')}
        >
          All
        </button>
        <button
          type='button'
          className={`blog-category-filter ${blogCategory === 'MANIFESTO' ? 'active' : ''}`}
          onClick={() => setBlogCategory('MANIFESTO')}
        >
          Manifestos
        </button>
        <button
          type='button'
          className={`blog-category-filter ${blogCategory === 'STYLE GUIDE' ? 'active' : ''}`}
          onClick={() => setBlogCategory('STYLE GUIDE')}
        >
          Style Guides
        </button>
        <button
          type='button'
          className={`blog-category-filter ${blogCategory === 'CRAFTSMANSHIP' ? 'active' : ''}`}
          onClick={() => setBlogCategory('CRAFTSMANSHIP')}
        >
          Craftsmanship
        </button>
        <button
          type='button'
          className={`blog-category-filter ${blogCategory === 'CULTURE' ? 'active' : ''}`}
          onClick={() => setBlogCategory('CULTURE')}
        >
          Culture
        </button>
        <button
          type='button'
          className={`blog-category-filter ${blogCategory === 'DROPS' ? 'active' : ''}`}
          onClick={() => setBlogCategory('DROPS')}
        >
          Drops
        </button>
      </div>
      <div className='blog-bento-grid'>
        {filteredBlog
          .filter((p) => !p.featured)
          .map((post, index) => {
            // Balanced pattern: some variety without too much extremes
            const pattern = [
              'bento-wide',
              'bento-normal',
              'bento-normal',
              'bento-tall',
              'bento-normal',
              'bento-wide',
              'bento-normal',
              'bento-normal',
            ];
            const sizeClass = pattern[index % pattern.length];

            return (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className={`blog-card-link ${sizeClass}`}
              >
                <div className='blog-card'>
                  <div className='blog-card-image'>
                    <Skull className='blog-card-placeholder' />
                  </div>
                  <div className='blog-card-content'>
                    <span className='blog-card-category'>{post.category}</span>
                    <h3 className='blog-card-title'>{post.title}</h3>
                    <p className='blog-card-excerpt'>{post.excerpt}</p>
                    <div className='blog-card-footer'>
                      <span className='blog-card-author'>by {post.author}</span>
                      <span className='blog-card-date'>
                        {post.date} · {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
