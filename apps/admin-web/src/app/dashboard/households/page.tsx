'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '../../components/DashboardLayout';
import { getHouseholds, createHousehold, deleteHousehold } from '../../lib/api';

export default function HouseholdsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [households, setHouseholds] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || 'all');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(searchParams?.get('action') === 'create');

  useEffect(() => {
    loadHouseholds();
  }, [search, statusFilter, page]);

  async function loadHouseholds() {
    setLoading(true);
    try {
      const data = await getHouseholds({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        pageSize: 20,
      });

      setHouseholds(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load households:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteHousehold(id);
      loadHouseholds();
    } catch (error: any) {
      alert(`Failed to delete: ${error.message}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Households</h2>
            <p className="text-muted-foreground mt-1">
              Manage your guest households and RSVP links
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            ➕ Add Household
          </button>
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
                placeholder="Search by name, email..."
                className="input"
              />
            </div>
            <div>
              <label className="label block mb-2">RSVP Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Households</option>
                <option value="responded">Responded</option>
                <option value="not_responded">Not Responded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <div className="p-6 border-b">
            <p className="text-sm text-muted-foreground">
              Showing {households.length} of {total} households
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : households.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No households found</p>
            </div>
          ) : (
            <div className="divide-y">
              {households.map((household) => (
                <div
                  key={household.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {household.displayName}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>👥 {household.guests.length} guests</span>
                        {household.rsvpLastSubmittedAt ? (
                          <span className="text-green-600">
                            ✅ Responded {new Date(household.rsvpLastSubmittedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-yellow-600">
                            ⏳ No response yet
                          </span>
                        )}
                      </div>
                      {household.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          📝 {household.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/households/${household.id}`)}
                        className="btn-secondary text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(household.id, household.displayName)}
                        className="btn-destructive text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / 20)}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateHouseholdModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadHouseholds();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function CreateHouseholdModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [displayName, setDisplayName] = useState('');
  const [notes, setNotes] = useState('');
  const [guests, setGuests] = useState([{ firstName: '', lastName: '', email: '', phone: '', isPrimary: true }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdToken, setCreatedToken] = useState('');

  const addGuest = () => {
    setGuests([...guests, { firstName: '', lastName: '', email: '', phone: '', isPrimary: false }]);
  };

  const updateGuest = (index: number, field: string, value: any) => {
    const newGuests = [...guests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setGuests(newGuests);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await createHousehold({
        displayName,
        notes: notes || undefined,
        guests: guests.map(g => ({
          firstName: g.firstName,
          lastName: g.lastName,
          email: g.email || undefined,
          phone: g.phone || undefined,
          isPrimary: g.isPrimary,
        })),
      });

      setCreatedToken(result.rsvpToken);
    } catch (err: any) {
      setError(err.message || 'Failed to create household');
      setSubmitting(false);
    }
  };

  if (createdToken) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const rsvpUrl = `${siteUrl}/rsvp?t=${createdToken}`;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-8">
          <h3 className="text-2xl font-bold mb-4">✅ Household Created!</h3>
          <p className="text-muted-foreground mb-6">
            The household has been created successfully. Here's the RSVP link:
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium mb-2">RSVP Link:</p>
            <code className="text-xs break-all block bg-white p-3 rounded border">
              {rsvpUrl}
            </code>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-900">
              ⚠️ <strong>Important:</strong> Save this link! It won't be shown again. Send this link to the household in your invitation email.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(rsvpUrl);
                alert('Link copied to clipboard!');
              }}
              className="btn-secondary flex-1"
            >
              📋 Copy Link
            </button>
            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="btn-primary flex-1"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Create New Household</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="label block mb-2">Household Name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="input"
              placeholder="The Smith Family"
            />
          </div>

          <div>
            <label className="label block mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input"
              placeholder="Friends from university"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="label">Guests *</label>
              <button type="button" onClick={addGuest} className="btn-secondary text-sm">
                ➕ Add Guest
              </button>
            </div>

            <div className="space-y-4">
              {guests.map((guest, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Guest {index + 1} {guest.isPrimary && '(Primary)'}
                    </span>
                    {guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="text-destructive text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={guest.firstName}
                      onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                      required
                      className="input"
                      placeholder="First name"
                    />
                    <input
                      type="text"
                      value={guest.lastName}
                      onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                      required
                      className="input"
                      placeholder="Last name"
                    />
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => updateGuest(index, 'email', e.target.value)}
                      className="input"
                      placeholder="Email (optional)"
                    />
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => updateGuest(index, 'phone', e.target.value)}
                      className="input"
                      placeholder="Phone (optional)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Creating...' : 'Create Household'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
