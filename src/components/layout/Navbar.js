'use client';

import { useState } from 'react';
import Link from 'next/link';

const links = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#dimensions', label: 'Trust DNA' },
  { href: '/tentang', label: 'About CAN' },
];

export default function Navbar({ currentPage = 'home' }) {
  const [open, setOpen] = useState(false);
  const sectionPrefix = currentPage === 'home' ? '' : '/';

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="can-header">
      <nav className="can-nav" aria-label="Main navigation">
        <Link className="can-wordmark" href="/" aria-label="CAN home">
          CAN<span>.</span>
        </Link>

        <div className="can-nav-links">
          {links.map((link) => (
            <Link
              className="can-nav-link"
              href={link.href.startsWith('#') ? `${sectionPrefix}${link.href}` : link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link className="can-button" href="/scan">
          {currentPage === 'scan' ? 'New demo scan' : 'Open demo scan'}
        </Link>

        <button
          className="can-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="can-mobile-menu"
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          {open ? 'Close menu' : 'Menu'}
        </button>
      </nav>

      <div
        className="can-mobile-menu"
        id="can-mobile-menu"
        data-open={open}
        aria-label="Mobile navigation"
      >
        {links.map((link) => (
          <Link
            href={link.href.startsWith('#') ? `${sectionPrefix}${link.href}` : link.href}
            key={link.href}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <Link className="can-button" href="/scan" onClick={closeMenu}>
          {currentPage === 'scan' ? 'New demo scan' : 'Open demo scan'}
        </Link>
      </div>
    </header>
  );
}