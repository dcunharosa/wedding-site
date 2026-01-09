'use client';

import { useState, useEffect } from 'react';
import { submitRsvp, submitChangeRequest } from '@/lib/api';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  isPrimary: boolean;
  attendanceRequiresGuestId?: string | null;
  currentResponse?: {
    attending: boolean;
    dietaryRestrictions?: string | null;
  };
}

interface HouseholdData {
  id: string;
  displayName: string;
  guests: Guest[];
  extras?: {
    songRequestText?: string | null;
    songRequestSpotifyUrl?: string | null;
  };
  canEdit: boolean;
  deadlineInfo: {
    deadline: string;
    passed: boolean;
  };
}

interface RsvpFormProps {
  household: HouseholdData;
  token: string;
}

export function RsvpForm({ household, token }: RsvpFormProps) {
  const [responses, setResponses] = useState<Record<string, { attending: boolean; dietary: string }>>({});
  const [songRequest, setSongRequest] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [changeRequestMessage, setChangeRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<any[]>([]);

  // Initialize responses from current state
  useEffect(() => {
    const initial: Record<string, { attending: boolean; dietary: string }> = {};
    household.guests.forEach((guest) => {
      initial[guest.id] = {
        attending: guest.currentResponse?.attending ?? false,
        dietary: guest.currentResponse?.dietaryRestrictions ?? '',
      };
    });
    setResponses(initial);

    if (household.extras) {
      setSongRequest(household.extras.songRequestText ?? '');
      setSpotifyUrl(household.extras.songRequestSpotifyUrl ?? '');
    }
  }, [household]);

  // Handle dependency rules in UI
  const handleAttendanceChange = (guestId: string, attending: boolean) => {
    const newResponses = { ...responses };
    newResponses[guestId] = { ...newResponses[guestId], attending };

    // If this guest is required by others, enforce rule
    household.guests.forEach((guest) => {
      if (guest.attendanceRequiresGuestId === guestId && !attending) {
        // Force dependent to NOT attend
        newResponses[guest.id] = { ...newResponses[guest.id], attending: false };
      }
    });

    setResponses(newResponses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setCorrections([]);

    try {
      const data = {
        responses: Object.entries(responses).map(([guestId, { attending, dietary }]) => ({
          guestId,
          attending,
          dietaryRestrictions: dietary || null,
        })),
        songRequestText: songRequest || null,
        songRequestSpotifyUrl: spotifyUrl || null,
      };

      const result = await submitRsvp(token, data);

      if (result.corrected && result.corrected.length > 0) {
        setCorrections(result.corrected);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('RSVP submission error:', err);
      setError(err.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitChangeRequest(token, changeRequestMessage);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Change request error:', err);
      setError(err.message || 'Failed to submit change request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center animate-fade-in">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl mb-4 text-green-900">
          {household.deadlineInfo.passed ? 'Change Request Submitted' : 'Thank You!'}
        </h2>
        <p className="text-green-700 mb-4">
          {household.deadlineInfo.passed
            ? 'We\'ve received your change request and will get back to you soon.'
            : 'Your RSVP has been successfully submitted.'}
        </p>
        {corrections.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-left">
            <p className="font-semibold text-yellow-900 mb-2">Note:</p>
            {corrections.map((correction, idx) => (
              <p key={idx} className="text-sm text-yellow-800">
                {correction.reason}
              </p>
            ))}
          </div>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="btn-primary mt-6"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Post-deadline view (change request form)
  if (household.deadlineInfo.passed && !household.canEdit) {
    return (
      <div className="space-y-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-900">
            The RSVP deadline has passed. If you need to make changes, please submit a request below and we'll get back to you.
          </p>
        </div>

        {/* Show current RSVP */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl mb-6">Your Current RSVP</h3>
          <div className="space-y-4">
            {household.guests.map((guest) => (
              <div key={guest.id} className="flex justify-between py-3 border-b border-sage-100">
                <span className="font-medium">{guest.firstName} {guest.lastName}</span>
                <span className={guest.currentResponse?.attending ? 'text-green-700' : 'text-red-700'}>
                  {guest.currentResponse?.attending ? 'Attending' : 'Not Attending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Change request form */}
        <form onSubmit={handleChangeRequest} className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl mb-6">Request a Change</h3>
          <div className="mb-6">
            <label htmlFor="message" className="block text-lg font-medium mb-2">
              What would you like to change?
            </label>
            <textarea
              id="message"
              value={changeRequestMessage}
              onChange={(e) => setChangeRequestMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="Please describe the changes you need to make..."
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Change Request'}
          </button>
        </form>
      </div>
    );
  }

  // Regular RSVP form
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h3 className="text-2xl mb-6">For {household.displayName}</h3>

        <div className="space-y-6">
          {household.guests.map((guest) => {
            const isDependent = !!guest.attendanceRequiresGuestId;
            const requiredGuest = household.guests.find((g) => g.id === guest.attendanceRequiresGuestId);
            const isDisabled = isDependent && !responses[guest.attendanceRequiresGuestId!]?.attending;

            return (
              <div key={guest.id} className="border-b border-sage-100 pb-6 last:border-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-medium mb-1">
                      {guest.firstName} {guest.lastName}
                    </h4>
                    {isDependent && requiredGuest && (
                      <p className="text-sm text-charcoal/60">
                        Must attend with {requiredGuest.firstName} {requiredGuest.lastName}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attending-${guest.id}`}
                        checked={responses[guest.id]?.attending === true}
                        onChange={() => handleAttendanceChange(guest.id, true)}
                        disabled={isDisabled}
                        className="w-5 h-5 text-sage-600 focus:ring-sage-500"
                      />
                      <span className={isDisabled ? 'text-charcoal/40' : ''}>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attending-${guest.id}`}
                        checked={responses[guest.id]?.attending === false}
                        onChange={() => handleAttendanceChange(guest.id, false)}
                        className="w-5 h-5 text-sage-600 focus:ring-sage-500"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {responses[guest.id]?.attending && (
                  <div className="mt-4">
                    <label htmlFor={`dietary-${guest.id}`} className="block text-sm font-medium mb-2">
                      Dietary Restrictions / Allergies (optional)
                    </label>
                    <input
                      type="text"
                      id={`dietary-${guest.id}`}
                      value={responses[guest.id]?.dietary || ''}
                      onChange={(e) =>
                        setResponses({
                          ...responses,
                          [guest.id]: { ...responses[guest.id], dietary: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="e.g., Vegetarian, Gluten-free, Nut allergy"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Song Request (if enabled and at least one person attending) */}
      {Object.values(responses).some((r) => r.attending) && (
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl mb-6">Song Request (Optional)</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="songRequest" className="block text-sm font-medium mb-2">
                Request a song for the reception
              </label>
              <input
                type="text"
                id="songRequest"
                value={songRequest}
                onChange={(e) => setSongRequest(e.target.value)}
                className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                placeholder="Song title and artist"
              />
            </div>
            <div>
              <label htmlFor="spotifyUrl" className="block text-sm font-medium mb-2">
                Spotify link (optional)
              </label>
              <input
                type="url"
                id="spotifyUrl"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                placeholder="https://open.spotify.com/track/..."
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-5"
      >
        {submitting ? 'Submitting...' : 'Submit RSVP'}
      </button>

      <p className="text-sm text-center text-charcoal/60">
        Deadline: {new Date(household.deadlineInfo.deadline).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </form>
  );
}
