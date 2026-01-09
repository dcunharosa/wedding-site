import { getContent } from '../../lib/api';

export const revalidate = 60;

export default async function GiftsPage() {
  let content;
  try {
    content = await getContent(['GIFTS_PAGE']);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    content = {};
  }

  const gifts = content.GIFTS_PAGE || {
    heading: 'Gifts',
    body: 'Your presence at our wedding is the greatest gift of all. However, if you wish to give us something, we would be grateful for a contribution towards our honeymoon adventures.',
    bankDetails: {
      accountName: 'Filipa & Duarte',
      sortCode: '',
      accountNumber: '',
      reference: 'Your surname',
    },
  };

  return (
    <div className="pt-32 pb-20 bg-linen">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <p className="eyebrow mb-4">Registry</p>
          <h1 className="mb-12 animate-fade-in">{gifts.heading}</h1>

          <p className="text-body-lg text-driftwood mb-16 leading-relaxed">
            {gifts.body}
          </p>

          <div className="card">
            <h2 className="text-display-sm mb-8 font-serif">Bank Details</h2>
            <div className="space-y-4 text-left">
              <div className="flex justify-between py-3 border-b border-sand">
                <span className="font-medium text-driftwood">Account Name:</span>
                <span className="font-semibold text-ink">{gifts.bankDetails.accountName}</span>
              </div>
              {gifts.bankDetails.sortCode && (
                <div className="flex justify-between py-3 border-b border-sand">
                  <span className="font-medium text-driftwood">Sort Code:</span>
                  <span className="font-mono font-semibold text-ink">{gifts.bankDetails.sortCode}</span>
                </div>
              )}
              {gifts.bankDetails.accountNumber && (
                <div className="flex justify-between py-3 border-b border-sand">
                  <span className="font-medium text-driftwood">Account Number:</span>
                  <span className="font-mono font-semibold text-ink">{gifts.bankDetails.accountNumber}</span>
                </div>
              )}
              <div className="flex justify-between py-3">
                <span className="font-medium text-driftwood">Reference:</span>
                <span className="font-semibold text-ink">{gifts.bankDetails.reference}</span>
              </div>
            </div>
          </div>

          <p className="text-label text-driftwood mt-8">
            Please use your surname as the payment reference so we can thank you properly
          </p>
        </div>
      </div>
    </div>
  );
}
