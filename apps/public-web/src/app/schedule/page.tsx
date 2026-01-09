import { getContent } from '../../lib/api';

export const revalidate = 60;

export default async function SchedulePage() {
  let content;
  try {
    content = await getContent(['SCHEDULE']);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    content = {};
  }

  const schedule = content.SCHEDULE || {
    heading: 'The Day',
    sections: [
      { time: '2:00 PM', title: 'Ceremony', description: 'The Manor House Garden' },
      { time: '3:30 PM', title: 'Reception', description: 'Champagne and canapés' },
      { time: '6:00 PM', title: 'Dinner', description: 'Three-course meal' },
      { time: '8:00 PM', title: 'Dancing', description: 'Party until late' },
    ],
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-center mb-16 animate-fade-in">{schedule.heading}</h1>

          <div className="space-y-12">
            {schedule.sections.map((item: any, index: number) => (
              <div
                key={index}
                className="flex gap-8 pb-12 border-b border-sage-200 last:border-0 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-32">
                  <div className="text-3xl font-serif font-light text-sage-700">
                    {item.time}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl mb-2">{item.title}</h3>
                  <p className="text-lg text-charcoal/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-sage-50 rounded-lg">
            <h3 className="text-xl mb-4">Important Information</h3>
            <ul className="space-y-3 text-charcoal/70">
              <li>• Please arrive by 1:45 PM to be seated before the ceremony</li>
              <li>• The ceremony and reception are outdoors, weather permitting</li>
              <li>• Dress code: Smart casual (ladies may want to avoid high heels)</li>
              <li>• Parking is available on-site</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
