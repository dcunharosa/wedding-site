import { getContent } from '../../lib/api';

export const revalidate = 60;

export default async function FaqPage() {
  let content;
  try {
    content = await getContent(['FAQ']);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    content = {};
  }

  const faq = content.FAQ || {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'What should I wear?',
        answer: 'We suggest smart casual attire. Ladies might want to avoid stiletto heels as parts of the venue are outdoors.',
      },
      {
        question: 'Can I bring children?',
        answer: 'We love your little ones, but we have decided to keep our wedding adults-only. We hope you understand.',
      },
      {
        question: 'What time should I arrive?',
        answer: 'Please arrive by 1:45 PM to be seated before the ceremony begins at 2:00 PM.',
      },
    ],
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-center mb-16 animate-fade-in">{faq.heading}</h1>

          <div className="space-y-8">
            {faq.items.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-2xl mb-4 text-sage-700">{item.question}</h3>
                <p className="text-lg text-charcoal/70 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-charcoal/70 mb-6">
              Have another question?
            </p>
            <a
              href="mailto:hello@emmaandjames.com"
              className="text-sage-700 hover:text-sage-900 font-medium link-underline"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
