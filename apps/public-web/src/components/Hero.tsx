'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  heading: string;
  subheading?: string;
  date: string;
  location: string;
  tagline?: string;
  imageId?: string | null;
}

// Cream filter for illustrations
const illustrationFilter = 'brightness(0) saturate(100%) invert(95%) sepia(5%) saturate(200%) hue-rotate(20deg) brightness(103%) contrast(95%)';

export function Hero({ heading, date, location, tagline }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay for more dramatic reveal
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-sky overflow-hidden grain-overlay">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky/0 via-sky/0 to-black/10 pointer-events-none" />

      {/* Hand-drawn illustrations with staggered fade-in */}

      {/* Big Ben - top left */}
      <div
        className={`absolute top-20 left-4 md:left-12 lg:left-20 w-12 md:w-16 lg:w-20 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-50 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <Image
          src="/illustrations/big-ben.svg"
          alt=""
          width={80}
          height={200}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Flower vase - top right */}
      <div
        className={`absolute top-20 right-4 md:right-12 lg:right-20 w-16 md:w-20 lg:w-24 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-50 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <Image
          src="/illustrations/flower-vase.svg"
          alt=""
          width={100}
          height={140}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Seagulls - upper middle */}
      <div
        className={`absolute top-12 md:top-16 left-1/2 -translate-x-1/2 w-20 md:w-28 lg:w-32 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-40 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <Image
          src="/illustrations/seagulls.svg"
          alt=""
          width={120}
          height={60}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Music notes - left side */}
      <div
        className={`absolute top-1/3 left-2 md:left-8 lg:left-16 w-12 md:w-16 lg:w-20 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-40 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        <Image
          src="/illustrations/music-notes.svg"
          alt=""
          width={100}
          height={80}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Dancing figure - right side */}
      <div
        className={`absolute top-1/3 right-2 md:right-8 lg:right-16 w-12 md:w-16 lg:w-20 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-50 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        <Image
          src="/illustrations/dancer.svg"
          alt=""
          width={100}
          height={150}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Cristo Redentor - bottom left */}
      <div
        className={`absolute bottom-24 md:bottom-28 left-4 md:left-12 lg:left-20 w-14 md:w-18 lg:w-24 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Image
          src="/illustrations/cristo-redentor.svg"
          alt=""
          width={100}
          height={180}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Amore text - bottom center-left */}
      <div
        className={`absolute bottom-20 md:bottom-24 left-1/4 w-16 md:w-20 lg:w-24 transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-35 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Image
          src="/illustrations/amore.svg"
          alt=""
          width={100}
          height={50}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Dunes - bottom spanning width */}
      <div
        className={`absolute bottom-0 left-0 right-0 w-full transition-all duration-1200 delay-400 ${
          isVisible ? 'opacity-35 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <Image
          src="/illustrations/dunes.svg"
          alt=""
          width={200}
          height={80}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Heart - decorative accent */}
      <div
        className={`absolute bottom-36 md:bottom-40 right-8 md:right-16 lg:right-24 w-8 md:w-10 lg:w-12 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-35 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <Image
          src="/illustrations/heart.svg"
          alt=""
          width={60}
          height={55}
          className="w-full h-auto"
          style={{ filter: illustrationFilter }}
        />
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 text-center px-6 md:px-8 max-w-4xl mx-auto transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)' }}
      >
        {/* Save the Date eyebrow */}
        <p
          className={`text-linen text-xs md:text-sm tracking-[0.35em] uppercase mb-6 md:mb-8 font-sans transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Save the Date
        </p>

        {/* Names - large serif */}
        <h1
          className={`font-serif font-light text-white text-4xl md:text-6xl lg:text-8xl tracking-wider mb-8 md:mb-10 leading-[1.1] uppercase transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {heading}
        </h1>

        {/* Tagline */}
        {tagline && (
          <p
            className={`text-white/85 text-base md:text-lg lg:text-xl max-w-lg mx-auto mb-12 md:mb-14 font-light leading-relaxed transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {tagline}
          </p>
        )}

        {/* Location and date */}
        <div
          className={`space-y-2 md:space-y-3 mb-12 md:mb-14 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-linen text-base md:text-lg lg:text-xl tracking-widest font-light">
            {location}
          </p>
          <p className="text-white text-xl md:text-2xl lg:text-3xl font-serif tracking-wide">
            {date}
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 md:gap-5 justify-center transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/rsvp"
            className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-3.5 bg-linen text-gray-800 font-medium rounded-md hover:bg-white hover:shadow-md transition-all duration-300 text-sm md:text-base"
          >
            RSVP
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-3.5 border-2 border-linen/90 text-linen font-medium rounded-md hover:bg-linen/10 transition-all duration-300 text-sm md:text-base"
          >
            View Weekend
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-linen/70">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <svg
            className="w-4 h-4 md:w-5 md:h-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
