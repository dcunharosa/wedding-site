'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../../components/DashboardLayout';
import { getHousehold, updateHousehold, deleteHousehold } from '../../../../lib/api';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  attendanceRequiresGuestId?: string;
}

interface Household {
  id: string;
  displayName: string;
  notes?: string;
  rsvpLastSubmittedAt?: string;
  createdAt: string;
  guests: Guest[];
  latestSubmission?: {
    submittedAt: string;
    responses: Array<{
      guestId: string;
      attending: boolean;
      dietaryRestrictions?: string;
    }>;
    extras?: {
      songRequestText?: string;
      songRequestSpotifyUrl?: string;
    };
  };
}

export default function HouseholdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadHousehold();
    }
  }, [id]);

  async function loadHousehold() {
    setLoading(true);
    setError('');
    try {
      const data = await getHousehold(id);
      setHousehold(data);
      setEditForm({ displayName: data.displayName, notes: data.notes || '' });
    } catch (err) {
      console.error('Failed to load household:', err);
      setError('Failed to load household details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateHousehold(id, editForm);
      await loadHousehold();
      setEditing(false);
    } catch (err) {
      console.error('Failed to update household:', err);
      alert('Failed to update household');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${household?.displayName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteHousehold(id);
      router.push('/dashboard/households');
    } catch (err) {
      console.error('Failed to delete household:', err);
      alert('Failed to delete household');
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-sand border-t-ink rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !household) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || 'Household not found'}</p>
          <button onClick={() => router.back()} className="btn-secondary">
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const getGuestResponse = (guestId: string) => {
    return household.latestSubmission?.responses?.find((r) => r.guestId === guestId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-driftwood hover:text-ink mb-2 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Households
            </button>
            {editing ? (
              <input
                type="text"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                className="input text-display-md font-serif"
              />
            ) : (
              <h1 className="text-display-lg font-serif font-light text-ink">
                {household.displayName}
              </h1>
            )}
            <p className="text-driftwood mt-1">
              Created {new Date(household.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="btn-secondary">
                  Edit
                </button>
                <button onClick={handleDelete} className="btn-destructive">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="card p-6">
          <div className="flex items-center gap-4">
            {household.rsvpLastSubmittedAt ? (
              <>
                <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center">
                  <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-ink">RSVP Received</p>
                  <p className="text-sm text-driftwood">
                    Responded on {new Date(household.rsvpLastSubmittedAt).toLocaleDateString()}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-warning-light flex items-center justify-center">
                  <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-ink">Awaiting Response</p>
                  <p className="text-sm text-driftwood">No RSVP submitted yet</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="card p-6">
          <h2 className="text-lg font-serif mb-4">Notes</h2>
          {editing ? (
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              rows={3}
              className="input"
              placeholder="Add notes about this household..."
            />
          ) : (
            <p className="text-driftwood">
              {household.notes || 'No notes added'}
            </p>
          )}
        </div>

        {/* Guests */}
        <div className="card">
          <div className="p-6 border-b border-sand">
            <h2 className="text-lg font-serif">Guests ({household.guests.length})</h2>
          </div>
          <div className="divide-y divide-sand">
            {household.guests.map((guest) => {
              const response = getGuestResponse(guest.id);
              return (
                <div key={guest.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-ink">
                          {guest.firstName} {guest.lastName}
                        </h3>
                        {guest.isPrimary && (
                          <span className="badge-info text-xs">Primary</span>
                        )}
                        {response && (
                          <span className={response.attending ? 'badge-success' : 'badge-neutral'}>
                            {response.attending ? 'Attending' : 'Not Attending'}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-driftwood">
                        {guest.email && (
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {guest.email}
                          </p>
                        )}
                        {guest.phone && (
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {guest.phone}
                          </p>
                        )}
                        {response?.dietaryRestrictions && (
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Dietary: {response.dietaryRestrictions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Song Request */}
        {household.latestSubmission?.extras?.songRequestText && (
          <div className="card p-6">
            <h2 className="text-lg font-serif mb-4">Song Request</h2>
            <p className="text-ink">{household.latestSubmission.extras.songRequestText}</p>
            {household.latestSubmission.extras.songRequestSpotifyUrl && (
              <a
                href={household.latestSubmission.extras.songRequestSpotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-sm mt-2 inline-flex items-center gap-1"
              >
                Open in Spotify
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
