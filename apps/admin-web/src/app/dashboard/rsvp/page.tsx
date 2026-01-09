'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { getHouseholds } from '../../../lib/api';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface Household {
  id: string;
  displayName: string;
  rsvpLastSubmittedAt: string | null;
  guests: Guest[];
  latestSubmission?: {
    responses: Array<{
      guestId: string;
      attending: boolean;
      dietaryRestrictions?: string;
    }>;
    extras?: {
      songRequestText?: string;
    };
  };
}

export default function RsvpTrackingPage() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'responded' | 'not_responded' | 'attending' | 'declined'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getHouseholds({ pageSize: 1000 });
      setHouseholds(data.items);
    } catch (error) {
      console.error('Failed to load households:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredHouseholds = households.filter((h) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesName = h.displayName.toLowerCase().includes(searchLower);
      const matchesGuest = h.guests.some(
        (g) =>
          g.firstName.toLowerCase().includes(searchLower) ||
          g.lastName.toLowerCase().includes(searchLower) ||
          g.email?.toLowerCase().includes(searchLower)
      );
      if (!matchesName && !matchesGuest) return false;
    }

    // Status filter
    switch (filter) {
      case 'responded':
        return h.rsvpLastSubmittedAt !== null;
      case 'not_responded':
        return h.rsvpLastSubmittedAt === null;
      case 'attending':
        return h.latestSubmission?.responses?.some((r) => r.attending) ?? false;
      case 'declined':
        return (
          h.rsvpLastSubmittedAt !== null &&
          h.latestSubmission?.responses?.every((r) => !r.attending)
        );
      default:
        return true;
    }
  });

  // Calculate stats
  const stats = {
    total: households.length,
    responded: households.filter((h) => h.rsvpLastSubmittedAt).length,
    notResponded: households.filter((h) => !h.rsvpLastSubmittedAt).length,
    totalGuests: households.reduce((sum, h) => sum + h.guests.length, 0),
    attendingGuests: households.reduce((sum, h) => {
      return sum + (h.latestSubmission?.responses?.filter((r) => r.attending).length ?? 0);
    }, 0),
    declinedGuests: households.reduce((sum, h) => {
      return sum + (h.latestSubmission?.responses?.filter((r) => !r.attending).length ?? 0);
    }, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">RSVP Tracking</h2>
          <p className="text-muted-foreground mt-1">
            Track responses and manage guest attendance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <p className="text-sm text-muted-foreground">Total Households</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-muted-foreground">Responded</p>
            <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-muted-foreground">Awaiting Response</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.notResponded}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-muted-foreground">Attending</p>
            <p className="text-2xl font-bold text-primary">
              {stats.attendingGuests} / {stats.totalGuests} guests
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-2">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="input"
              />
            </div>
            <div>
              <label className="label block mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="input"
              >
                <option value="all">All Households</option>
                <option value="responded">Responded</option>
                <option value="not_responded">Not Responded</option>
                <option value="attending">Has Attending Guests</option>
                <option value="declined">All Declined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <div className="p-4 border-b">
            <p className="text-sm text-muted-foreground">
              Showing {filteredHouseholds.length} of {households.length} households
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredHouseholds.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No households match your filters</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredHouseholds.map((household) => (
                <div key={household.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{household.displayName}</h3>
                        {household.rsvpLastSubmittedAt ? (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            Responded
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Guest responses */}
                      <div className="space-y-1">
                        {household.guests.map((guest) => {
                          const response = household.latestSubmission?.responses?.find(
                            (r) => r.guestId === guest.id
                          );

                          return (
                            <div
                              key={guest.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              {response ? (
                                response.attending ? (
                                  <span className="text-green-600">✓</span>
                                ) : (
                                  <span className="text-red-600">✗</span>
                                )
                              ) : (
                                <span className="text-gray-400">?</span>
                              )}
                              <span className={response?.attending === false ? 'text-gray-400 line-through' : ''}>
                                {guest.firstName} {guest.lastName}
                              </span>
                              {response?.dietaryRestrictions && (
                                <span className="text-xs text-muted-foreground">
                                  ({response.dietaryRestrictions})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Song request */}
                      {household.latestSubmission?.extras?.songRequestText && (
                        <p className="text-xs text-muted-foreground mt-2">
                          🎵 {household.latestSubmission.extras.songRequestText}
                        </p>
                      )}
                    </div>

                    {household.rsvpLastSubmittedAt && (
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Responded</p>
                        <p>{new Date(household.rsvpLastSubmittedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
