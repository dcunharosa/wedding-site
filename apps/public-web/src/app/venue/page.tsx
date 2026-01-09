import { getContent } from '../../lib/api';

export const revalidate = 60;

export default async function VenuePage() {
  let content;
  try {
    content = await getContent(['VENUE']);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    content = {};
  }

  const venue = content.VENUE || {
    heading: 'The Venue',
    name: 'The Manor House',
    address: '123 Country Lane, Cotswolds, GL54 1AB',
    description: 'A stunning 18th-century manor house set in beautiful gardens.',
    mapUrl: 'https://maps.google.com/?q=Cotswolds+Manor+House',
    parking: 'Free parking available on site',
    accommodation: 'Limited rooms available at the venue. Book early!',
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center mb-16 animate-fade-in">{venue.heading}</h1>

          <div className="space-y-16">
            {/* Venue Info */}
            <div className="text-center">
              <h2 className="text-4xl font-serif mb-4">{venue.name}</h2>
              <p className="text-xl text-charcoal/80 mb-6">{venue.description}</p>
              <p className="text-lg text-charcoal/60">{venue.address}</p>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-[16/9] bg-sage-100 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Travel Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl mb-4 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-sage-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  Parking
                </h3>
                <p className="text-charcoal/70">{venue.parking}</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl mb-4 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-sage-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Accommodation
                </h3>
                <p className="text-charcoal/70">{venue.accommodation}</p>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-sage-50 p-8 rounded-lg">
              <h3 className="text-2xl mb-6">Getting There</h3>
              <div className="space-y-4 text-charcoal/70">
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">By Car</h4>
                  <p>Approximately 2 hours from London via M40. Sat nav postcode: GL54 1AB</p>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">By Train</h4>
                  <p>Nearest station: Moreton-in-Marsh (20 minutes by taxi)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Local Taxis</h4>
                  <p>Cotswold Cabs: 01608 123456 · Book in advance for return journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
