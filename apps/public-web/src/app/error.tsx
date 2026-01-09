'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linen px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-display-md font-serif font-light text-ink mb-4">
          Something went wrong
        </h1>
        <p className="text-body-lg text-driftwood mb-8">
          We&apos;re sorry, but something unexpected happened. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
