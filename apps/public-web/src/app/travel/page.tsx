import { getContent } from '../../lib/api';

export const revalidate = 60;

export default async function TravelPage() {
  let content;
  try {
    content = await getContent(['TRAVEL']);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    content = {};
  }

  const travel = content.TRAVEL || {
    heading: 'Getting There',
    intro: 'Comporta is a beautiful coastal village about 1.5 hours south of Lisbon.',
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center mb-8 animate-fade-in">{travel.heading}</h1>
          <p className="text-xl text-center text-driftwood mb-16 max-w-2xl mx-auto">
            {travel.intro}
          </p>

          <div className="space-y-12">
            {/* By Air */}
            <div className="bg-shell p-8 rounded-lg border border-sand">
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-sky"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                By Air
              </h2>
              <div className="space-y-4 text-driftwood">
                <p>
                  <span className="font-medium text-ink">Lisbon Airport (LIS)</span> is the nearest international airport,
                  approximately 1.5 hours drive from Comporta.
                </p>
                <p>
                  There are direct flights from most major European cities including London, Paris, Amsterdam, and many more.
                </p>
              </div>
            </div>

            {/* By Car */}
            <div className="bg-shell p-8 rounded-lg border border-sand">
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-sky"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7h8m-8 4h8m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
                By Car
              </h2>
              <div className="space-y-4 text-driftwood">
                <p>
                  <span className="font-medium text-ink">From Lisbon:</span> Take the A2 motorway south,
                  then exit onto the N253 towards Comporta. The drive takes approximately 1.5 hours.
                </p>
                <p>
                  <span className="font-medium text-ink">Car Hire:</span> We recommend hiring a car to explore
                  the area. All major rental companies are available at Lisbon Airport.
                </p>
                <p className="text-sm italic">
                  Note: Having a car is highly recommended as Comporta is a rural area with limited public transport.
                </p>
              </div>
            </div>

            {/* Private Transfer */}
            <div className="bg-shell p-8 rounded-lg border border-sand">
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-sky"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Private Transfer
              </h2>
              <div className="space-y-4 text-driftwood">
                <p>
                  If you prefer not to drive, private transfers can be arranged from Lisbon Airport directly to your accommodation in Comporta.
                </p>
                <p>
                  We can help coordinate group transfers if several guests are arriving around the same time.
                  Please let us know your flight details.
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-linen p-8 rounded-lg">
              <h3 className="text-xl font-serif mb-4 text-ink">Travel Tips</h3>
              <ul className="space-y-3 text-driftwood">
                <li className="flex items-start gap-2">
                  <span className="text-sky mt-1">•</span>
                  <span>Book flights early for the best prices and availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky mt-1">•</span>
                  <span>Consider arriving a day early to relax before the celebrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky mt-1">•</span>
                  <span>September weather in Comporta is typically warm and sunny (25-30°C)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky mt-1">•</span>
                  <span>Don&apos;t forget sunscreen and comfortable shoes for the beach</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
