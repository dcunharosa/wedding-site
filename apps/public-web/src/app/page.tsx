import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '../components/Hero';
import { getContent } from '../lib/api';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let content;
  try {
    content = await getContent(['HOME_HERO', 'SCHEDULE', 'VENUE']);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    content = {};
  }

  const hero = content.HOME_HERO || {
    heading: 'Filipa & Duarte',
    subheading: '',
    date: '12 de Setembro de 2026',
    location: 'Comporta, Portugal',
    tagline: 'A relaxed weekend by the beach — with plenty of music.',
  };

  return (
    <>
      <Hero {...hero} />

      {/* At-a-glance strip - most important per guidelines */}
      <section className="py-8 bg-sky-tint12 border-y border-sand">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="info-chip">
              <p className="eyebrow mb-1">Date</p>
              <p className="text-body font-medium text-ink">12 Sept 2026</p>
            </div>
            <div className="info-chip">
              <p className="eyebrow mb-1">Location</p>
              <p className="text-body font-medium text-ink">Comporta</p>
            </div>
            <div className="info-chip">
              <p className="eyebrow mb-1">Dress Code</p>
              <p className="text-body font-medium text-ink">Beach Casual</p>
            </div>
            <div className="info-chip">
              <p className="eyebrow mb-1">RSVP By</p>
              <p className="text-body font-medium text-ink">1 June 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekend Overview Section */}
      <section className="section-padding bg-shell relative overflow-hidden">
        {/* Subtle illustration accents */}
        <div className="absolute top-8 right-8 w-16 opacity-10">
          <Image
            src="/illustrations/seagulls.svg"
            alt=""
            width={120}
            height={60}
            className="w-full h-auto"
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">The Weekend</p>
            <h2 className="mb-8 text-ink">Three Days of Celebration</h2>
            <div className="prose-custom space-y-6 text-driftwood">
              <p className="text-body-lg leading-relaxed">
                Join us for a relaxed weekend in Comporta, where the dunes meet the sea.
                We'll gather on Friday for welcome drinks, celebrate our wedding on Saturday,
                and say our goodbyes over a Sunday brunch by the beach.
              </p>
            </div>
          </div>

          {/* Weekend timeline cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="card text-center relative overflow-hidden">
              <div className="absolute top-2 right-2 w-8 opacity-15">
                <Image
                  src="/illustrations/flower-vase.svg"
                  alt=""
                  width={100}
                  height={140}
                  className="w-full h-auto"
                />
              </div>
              <p className="eyebrow mb-2">Friday</p>
              <h3 className="text-display-sm mb-3">Welcome</h3>
              <p className="text-driftwood">
                Welcome drinks at sunset
              </p>
            </div>
            <div className="card text-center border-sky relative overflow-hidden">
              <div className="absolute top-2 right-2 w-8 opacity-15">
                <Image
                  src="/illustrations/heart.svg"
                  alt=""
                  width={60}
                  height={55}
                  className="w-full h-auto"
                />
              </div>
              <p className="eyebrow mb-2">Saturday</p>
              <h3 className="text-display-sm mb-3">Wedding</h3>
              <p className="text-driftwood">
                Ceremony, dinner & party
              </p>
            </div>
            <div className="card text-center relative overflow-hidden">
              <div className="absolute top-2 right-2 w-8 opacity-15">
                <Image
                  src="/illustrations/music-notes.svg"
                  alt=""
                  width={100}
                  height={80}
                  className="w-full h-auto"
                />
              </div>
              <p className="eyebrow mb-2">Sunday</p>
              <h3 className="text-display-sm mb-3">Farewell</h3>
              <p className="text-driftwood">
                Beach brunch & goodbye
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/schedule" className="btn-secondary">
              View Full Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="section-padding bg-linen relative overflow-hidden">
        {/* Subtle dunes illustration */}
        <div className="absolute bottom-0 left-0 right-0 w-full opacity-5">
          <Image
            src="/illustrations/dunes.svg"
            alt=""
            width={200}
            height={80}
            className="w-full h-auto"
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow mb-4">What to Wear</p>
            <h2 className="mb-6 text-ink">Beach Casual</h2>
            <div className="space-y-4 text-driftwood">
              <p className="text-body-lg">Light fabrics — linen, cotton</p>
              <p className="text-body-lg">Sand-friendly shoes</p>
              <p className="text-body-lg">Bring a layer for the evening</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Call to Action - using sky blue like Save the Date */}
      <section className="section-padding bg-sky text-cream relative overflow-hidden">
        {/* Scattered illustrations like Save the Date */}
        <div className="absolute top-8 left-8 w-12 opacity-30">
          <Image
            src="/illustrations/dancer.svg"
            alt=""
            width={100}
            height={150}
            className="w-full h-auto"
            style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(12%) saturate(300%) hue-rotate(30deg) brightness(100%) contrast(90%)' }}
          />
        </div>
        <div className="absolute bottom-8 right-8 w-16 opacity-30">
          <Image
            src="/illustrations/music-notes.svg"
            alt=""
            width={100}
            height={80}
            className="w-full h-auto"
            style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(12%) saturate(300%) hue-rotate(30deg) brightness(100%) contrast(90%)' }}
          />
        </div>
        <div className="absolute top-12 right-1/4 w-10 opacity-20">
          <Image
            src="/illustrations/heart.svg"
            alt=""
            width={60}
            height={55}
            className="w-full h-auto"
            style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(12%) saturate(300%) hue-rotate(30deg) brightness(100%) contrast(90%)' }}
          />
        </div>

        <div className="container-custom text-center relative z-10">
          <h2 className="mb-6 text-cream">Will You Join Us?</h2>
          <p className="text-body-lg text-cream/70 mb-8 max-w-2xl mx-auto">
            We can't wait to celebrate with you. Please let us know if you can make it.
          </p>
          <Link
            href="/rsvp"
            className="inline-flex items-center justify-center px-10 py-4 bg-cream text-sky font-medium rounded-md hover:bg-white transition-colors duration-300"
          >
            RSVP Now
          </Link>
        </div>
      </section>
    </>
  );
}
