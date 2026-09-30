'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#dimensions', label: 'Trust DNA' },
  { href: '/academy', label: 'Academy' },
  { href: '/history', label: 'History' },
  { href: '/about', label: 'About CAN' },
];

export default function Navbar({ currentPage }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setOpen(false);
  }

  const isScan = currentPage === 'scan' || pathname === '/scan';

  return (
    <header className="can-header">
      <nav className="can-nav" aria-label="Main navigation">
        <Link className="can-wordmark" href="/" aria-label="CAN home" onClick={closeMenu}>
          CAN<span>.</span>
        </Link>

        <div className="can-nav-links">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                className={`can-nav-link ${isActive ? 'can-nav-link-active' : ''}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link className="can-button" href="/scan" onClick={closeMenu}>
          {isScan ? 'New scan' : 'Scan a website'}
        </Link>

        <button
          className="can-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="can-mobile-menu"
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div
        className="can-mobile-menu"
        id="can-mobile-menu"
        data-open={open}
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
        <Link className="can-button" href="/scan" onClick={closeMenu}>
          {isScan ? 'New scan' : 'Scan a website'}
        </Link>
      </div>
    </header>
  );
}