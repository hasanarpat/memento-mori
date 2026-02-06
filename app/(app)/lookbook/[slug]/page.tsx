'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { lookbookItems } from '../../../data/shop';

export default function LookbookDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const lookbook = lookbookItems.find((item) => item.slug === slug);

  if (!lookbook) {
    return (
      <div className='lookbook-post-page'>
        <div className='lookbook-container'>
          <Link href='/lookbook' className='back-link'>
            <ArrowLeft size={16} />
            Back to Lookbook
          </Link>
          <div className='not-found'>Collection not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className='lookbook-post-page'>
      <div className='lookbook-container'>
        <Link href='/lookbook' className='back-link'>
          <ArrowLeft size={16} />
          Back to Lookbook
        </Link>

        <div className='lookbook-header'>
          <h1 className='lookbook-title'>{lookbook.season}</h1>
          <p className='lookbook-year-display'>{lookbook.year}</p>
          <p className='lookbook-meta-category'>{lookbook.category}</p>
        </div>

        {lookbook.tagline && (
          <p className='lookbook-tagline'>{lookbook.tagline}</p>
        )}

        <div className='lookbook-content'>
          <div className='lookbook-description'>
            <p>{lookbook.description}</p>
          </div>

          {lookbook.details && (
            <div className='lookbook-details'>
              <h3 className='lookbook-subheading'>Collection Details</h3>
              <p>{lookbook.details}</p>
            </div>
          )}

          <nav className='lookbook-nav'>
            {lookbookItems.findIndex((item) => item.slug === slug) > 0 && (
              <Link
                href={`/lookbook/${lookbookItems[lookbookItems.findIndex((item) => item.slug === slug) - 1].slug}`}
                className='lookbook-nav-link prev'
              >
                ← Previous
              </Link>
            )}

            {lookbookItems.findIndex((item) => item.slug === slug) <
              lookbookItems.length - 1 && (
              <Link
                href={`/lookbook/${lookbookItems[lookbookItems.findIndex((item) => item.slug === slug) + 1].slug}`}
                className='lookbook-nav-link next'
              >
                Next →
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
