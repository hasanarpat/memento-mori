'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Standard delivery is 5-7 business days. Express options available at checkout.',
    },
    {
      q: 'What is your return policy?',
      a: '30-day returns for unworn items with original tags. See our Returns page for details.',
    },
    {
      q: 'How do I find my size?',
      a: 'Use our Size Guide for measurements. When in doubt, size up for a relaxed fit.',
    },
    {
      q: 'How do I care for my pieces?',
      a: 'Spot clean only for most items. Check the product care label for specifics.',
    },
  ];

  return (
    <div className='contact-page'>
      <h1 className='home-section-title'>Get in Touch</h1>
      <div className='contact-layout'>
        <div className='contact-form-wrap'>
          <form className='contact-form' onSubmit={(e) => e.preventDefault()}>
            <label>
              Name <span className='required'>*</span>
              <input type='text' required />
            </label>
            <label>
              Email <span className='required'>*</span>
              <input type='email' required />
            </label>
            <label>
              Subject
              <input type='text' />
            </label>
            <label>
              Message
              <textarea rows={6} required />
            </label>
            <button
              type='submit'
              className='home-cta-primary'
              style={{ width: '100%' }}
            >
              Send Message
            </button>
          </form>
        </div>
        <div className='contact-info'>
          <div className='contact-info-item'>
            <Mail size={24} />
            <div>
              <strong>Email</strong>
              <a href='mailto:hello@mementomori.com'>hello@mementomori.com</a>
            </div>
          </div>
          <div className='contact-info-item'>
            <Phone size={24} />
            <div>
              <strong>Phone</strong>
              <a href='tel:+901234567890'>+90 123 456 78 90</a>
            </div>
          </div>
          <div className='contact-info-item'>
            <MapPin size={24} />
            <div>
              <strong>Address</strong>
              <span>Istanbul, Turkey</span>
            </div>
          </div>
          <div className='contact-info-item'>
            <Clock size={24} />
            <div>
              <strong>Working Hours</strong>
              <span>Mon–Fri 10:00 – 18:00</span>
            </div>
          </div>
          <div className='contact-social'>
            <h3>Follow Us</h3>
            <div className='contact-social-btns'>
              <a href='#' aria-label='Instagram'>
                IG
              </a>
              <a href='#' aria-label='Twitter'>
                TW
              </a>
              <a href='#' aria-label='Pinterest'>
                PN
              </a>
              <a href='#' aria-label='TikTok'>
                TT
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className='contact-faq'>
        <h2 className='home-section-title'>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className='contact-faq-item'>
            <button
              type='button'
              className='contact-faq-btn'
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
            >
              {faq.q}
              {openFaq === i ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {openFaq === i && <div className='contact-faq-answer'>{faq.a}</div>}
          </div>
        ))}
      </section>

      <section className='contact-map-container'>
        <div className='contact-map-wrap'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192698.62919864223!2d28.847758252270928!3d41.00523120153835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1cc1e01f4ca15a2!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2str!4v1707240000000!5m2!1sen!2str'
            style={{ border: 0 }}
            allowFullScreen={true}
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            title='Memento Mori Location'
          ></iframe>
          <div className='contact-map-overlay'>
            <MapPin
              className='mb-2'
              style={{ color: 'var(--accent)' }}
              size={24}
            />
            <h3>THE ARCHIVE</h3>
            <p>Galata Tower District, Beyoğlu</p>
            <p>Istanbul, Turkey</p>
            <div className='mt-4 border-t border-blood-red pt-2 opacity-60'>
              <small>Open for rituals by appointment.</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
