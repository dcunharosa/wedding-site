'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RsvpForm } from '../../components/RsvpForm';
import { getHouseholdRsvp } from '../../lib/api';

export default function RsvpPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t');

  const [household, setHousehold] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No RSVP link provided. Please use the link from your invitation email.');
      setLoading(false);
      return;
    }

    async function loadHousehold(rsvpToken: string) {
      try {
        const data = await getHouseholdRsvp(rsvpToken);
        setHousehold(data);
      } catch (err: any) {
        console.error('Error loading household:', err);
        setError(
          err.status === 404
            ? 'Invalid RSVP link. Please check your invitation email.'
            : 'Failed to load RSVP information. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadHousehold(token);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal/60">Loading your RSVP...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl mb-4 text-red-900">Unable to Load RSVP</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!household) {
    return null;
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mb-4 animate-fade-in">RSVP</h1>
          <p className="text-xl text-charcoal/70">
            Please let us know if you can attend
          </p>
        </div>

        <RsvpForm household={household} token={token!} />
      </div>
    </div>
  );
}
