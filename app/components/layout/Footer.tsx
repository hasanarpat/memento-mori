import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section'>
          <h3>Navigate</h3>
          <Link href='/' className='footer-link'>
            Home
          </Link>
          <Link href='/lookbook' className='footer-link'>
            Lookbook
          </Link>
          <Link href='/collections' className='footer-link'>
            Collections
          </Link>
          <Link href='/journal' className='footer-link'>
            Journal
          </Link>
        </div>
        <div className='footer-section'>
          <h3>Codex</h3>
          <Link href='/kvkk' className='footer-link'>
            KVKK
          </Link>
          <Link href='/gizlilik-politikasi' className='footer-link'>
            Gizlilik
          </Link>
          <Link href='/size-guide' className='footer-link'>
            Sizing
          </Link>
          <Link href='/contact' className='footer-link'>
            Contact
          </Link>
        </div>
        <div className='footer-section'>
          <h3>Commune</h3>
          <a href='#' className='footer-link'>
            Discord
          </a>
          <a href='#' className='footer-link'>
            Instagram
          </a>
          <a href='#' className='footer-link'>
            Newsletter
          </a>
        </div>
        <div className='footer-section'>
          <h3>Manifesto</h3>
          <p>
            In darkness we find beauty. In leather and brass, our armor.
            In shadows, our truth.
          </p>
        </div>
      </div>
      <div className='footer-bottom'>
        © MMXXVI MEMENTO MORI — From dust to dust, from shadow to shadow
      </div>
    </footer>
  );
}
