'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Clock } from 'lucide-react';
import { blogPosts } from '../../../data/shop';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className='blog-post-not-found'>
        <h1>Post not found</h1>
        <Link href='/journal' className='home-cta-primary'>
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className='blog-post-page'>
      <div className='blog-post-header'>
        <Link href='/journal' className='blog-post-back'>
          <ArrowLeft size={20} />
          Back to Journal
        </Link>

        <div className='blog-post-meta-top'>
          <span className='blog-post-category'>{post.category}</span>
          <time dateTime={post.date} className='blog-post-date'>
            {post.date}
          </time>
        </div>

        <h1 className='blog-post-title'>{post.title}</h1>

        <div className='blog-post-meta'>
          <div className='blog-post-meta-item'>
            <User size={18} />
            <span>{post.author}</span>
          </div>
          <div className='blog-post-meta-item'>
            <Clock size={18} />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <div className='blog-post-content'>
        {post.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
            return (
              <h3 key={i} className='blog-post-subheading'>
                {paragraph.replace(/\*\*/g, '')}
              </h3>
            );
          }
          if (paragraph.startsWith('-')) {
            const items = paragraph
              .split('\n')
              .filter((item) => item.startsWith('-'));
            return (
              <ul key={i} className='blog-post-list'>
                {items.map((item, j) => (
                  <li key={j}>
                    {item.replace(/^-\s?\*\*/, '').replace(/\*\*:/, ':')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className='blog-post-paragraph'>
              {paragraph}
            </p>
          );
        })}
      </div>

      <div className='blog-post-footer'>
        <Link href='/journal' className='blog-post-footer-link'>
          <ArrowLeft size={18} />
          Back to Journal
        </Link>
      </div>
    </article>
  );
}
