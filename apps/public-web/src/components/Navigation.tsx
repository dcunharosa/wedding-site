'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Navigation items per guidelines: Home, Weekend, Venue, Travel, Stay, FAQ
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Weekend' },
  { href: '/venue', label: 'Venue' },
  { href: '/travel', label: 'Travel' },
  { href: '/stay', label: 'Stay' },
  { href: '/faq', label: 'FAQ' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we're on the homepage (which has the sky-colored hero)
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine text colors based on scroll state and page
  const isOnSkyBackground = isHomepage && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-linen/95 backdrop-blur-sm shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
      style={isOnSkyBackground ? { textShadow: '0 1px 3px rgba(0, 0, 0, 0.15)' } : undefined}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo/Names - using serif, editorial style */}
          <Link
            href="/"
            className={`font-serif text-xl md:text-2xl font-light tracking-wide transition-colors ${
              isOnSkyBackground
                ? 'text-white hover:text-white/80'
                : 'text-ink hover:opacity-70'
            }`}
          >
            Filipa & Duarte
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-label uppercase transition-colors ${
                  isOnSkyBackground
                    ? pathname === item.href
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                    : pathname === item.href
                      ? 'text-ink'
                      : 'text-driftwood hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/rsvp"
              className={`text-label uppercase px-6 py-3 rounded-md transition-colors ${
                isOnSkyBackground
                  ? 'bg-linen text-gray-700 hover:bg-white shadow-sm'
                  : 'btn-primary'
              }`}
            >
              RSVP
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-sky rounded-sm`}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full transition-transform ${
                  isOnSkyBackground ? 'bg-white' : 'bg-ink'
                } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`block h-0.5 w-full transition-opacity ${
                  isOnSkyBackground ? 'bg-white' : 'bg-ink'
                } ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`block h-0.5 w-full transition-transform ${
                  isOnSkyBackground ? 'bg-white' : 'bg-ink'
                } ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-6 pb-4 animate-slide-down border-t pt-6 ${
            isOnSkyBackground ? 'border-white/30' : 'border-sand'
          }`}>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-body uppercase tracking-wider py-2 ${
                    isOnSkyBackground
                      ? pathname === item.href
                        ? 'text-white'
                        : 'text-white/70'
                      : pathname === item.href
                        ? 'text-ink'
                        : 'text-driftwood'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/rsvp"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-center mt-4 px-6 py-3 rounded-md ${
                  isOnSkyBackground
                    ? 'bg-linen text-gray-700 shadow-sm'
                    : 'btn-primary'
                }`}
              >
                RSVP
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
