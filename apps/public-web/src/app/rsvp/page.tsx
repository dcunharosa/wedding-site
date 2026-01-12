import { Suspense } from 'react';
import RsvpContent from './RsvpContent';

function LoadingSpinner() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal/60">Loading your RSVP...</p>
      </div>
    </div>
  );
}

export default function RsvpPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RsvpContent />
    </Suspense>
  );
}
