import { getContent } from '../../lib/api';

export const revalidate = 60;

export default async function StayPage() {
  let content;
  try {
    content = await getContent(['STAY']);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    content = {};
  }

  const stay = content.STAY || {
    heading: 'Where to Stay',
    intro: 'Comporta offers a range of accommodation options, from boutique hotels to charming rental houses.',
  };

  const accommodations = [
    {
      name: 'Sublime Comporta',
      type: 'Luxury Hotel',
      description: 'A stunning country retreat with spacious suites, a world-class spa, and beautiful rice paddy views.',
      priceRange: '€€€€',
      website: 'https://sublimecomporta.pt',
      distance: '5 min from venue',
    },
    {
      name: 'Comporta Village',
      type: 'Rental Houses',
      description: 'Traditional fisherman houses converted into charming holiday rentals. Perfect for groups.',
      priceRange: '€€€',
      website: 'https://www.comportavillage.com',
      distance: '10 min from venue',
    },
    {
      name: 'Casa da Comporta',
      type: 'Boutique Hotel',
      description: 'Intimate boutique hotel with beautifully designed rooms and a relaxed atmosphere.',
      priceRange: '€€€',
      website: 'https://casadacomporta.com',
      distance: '8 min from venue',
    },
    {
      name: 'Airbnb & VRBO',
      type: 'Vacation Rentals',
      description: 'Various houses and apartments available for rent. Great option for families or groups wanting more space.',
      priceRange: '€€-€€€',
      website: 'https://www.airbnb.com',
      distance: 'Various locations',
    },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center mb-8 animate-fade-in">{stay.heading}</h1>
          <p className="text-xl text-center text-driftwood mb-16 max-w-2xl mx-auto">
            {stay.intro}
          </p>

          <div className="space-y-8">
            {accommodations.map((place, index) => (
              <div
                key={place.name}
                className="bg-shell p-8 rounded-lg border border-sand animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-serif text-ink">{place.name}</h2>
                    <p className="text-sm text-driftwood uppercase tracking-wider">{place.type}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-linen px-3 py-1 rounded-full text-driftwood">
                      {place.priceRange}
                    </span>
                    <span className="text-driftwood">{place.distance}</span>
                  </div>
                </div>
                <p className="text-driftwood mb-4">{place.description}</p>
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sky hover:text-sky/80 transition-colors"
                >
                  Visit Website
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Booking Tips */}
          <div className="mt-16 bg-linen p-8 rounded-lg">
            <h3 className="text-xl font-serif mb-4 text-ink">Booking Tips</h3>
            <ul className="space-y-3 text-driftwood">
              <li className="flex items-start gap-2">
                <span className="text-sky mt-1">•</span>
                <span>
                  <strong>Book early!</strong> September is a popular time in Comporta and accommodation fills up quickly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky mt-1">•</span>
                <span>
                  Consider staying Friday to Sunday to enjoy the full weekend of celebrations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky mt-1">•</span>
                <span>
                  If you&apos;re travelling with others, sharing a rental house can be a great (and fun!) option.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky mt-1">•</span>
                <span>
                  Let us know where you&apos;re staying so we can help coordinate transport if needed.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact for help */}
          <div className="mt-8 text-center text-driftwood">
            <p>
              Need help finding accommodation? <br className="md:hidden" />
              <a href="mailto:hello@wedding.com" className="text-sky hover:underline">
                Get in touch
              </a>{' '}
              and we&apos;ll be happy to help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
