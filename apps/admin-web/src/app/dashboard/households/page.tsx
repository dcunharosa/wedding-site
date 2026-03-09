'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { getHouseholds, createHousehold, deleteHousehold } from '../../../lib/api';
import { ImportCsvModal } from '../../../components/ImportCsvModal';

export default function HouseholdsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <HouseholdsPageInner />
    </Suspense>
  );
}

function HouseholdsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [households, setHouseholds] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || 'all');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(searchParams?.get('action') === 'create');
  const [showImportModal, setShowImportModal] = useState(false);

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
    if (!confirm(`Are you sure you want to remove ${name} from the guest list? This cannot be undone.`)) {
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
            <h2 className="text-3xl font-bold">Guests</h2>
            <p className="text-muted-foreground mt-1">
              Manage your guests and RSVP links
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="btn-secondary"
            >
              📥 Import CSV
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              ➕ Add Guest
            </button>
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
                <option value="all">All Guests</option>
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
              Showing {households.length} of {total} guests
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : households.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No guests found</p>
            </div>
          ) : (
            <div className="divide-y">
              {households.map((household) => {
                const primaryGuest = household.guests.find((g: any) => g.isPrimary) ?? household.guests[0];
                const hasPlusOne = household.guests.some((g: any) => g.isPlusOne);
                return (
                  <div
                    key={household.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {primaryGuest ? `${primaryGuest.firstName} ${primaryGuest.lastName}` : household.displayName}
                          </h3>
                          {hasPlusOne && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                              + Plus One
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                          onClick={() => handleDelete(household.id, primaryGuest ? `${primaryGuest.firstName} ${primaryGuest.lastName}` : household.displayName)}
                          className="btn-destructive text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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

      {/* Import Modal */}
      {showImportModal && (
        <ImportCsvModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            loadHouseholds();
          }}
        />
      )}

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [plusOneFirstName, setPlusOneFirstName] = useState('');
  const [plusOneLastName, setPlusOneLastName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdToken, setCreatedToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const guests = [
      {
        firstName,
        lastName,
        email: email || undefined,
        phone: phone || undefined,
        isPrimary: true,
        isPlusOne: false,
      },
    ];

    if (hasPlusOne) {
      guests.push({
        firstName: plusOneFirstName || 'Guest',
        lastName: plusOneLastName || 'Plus One',
        email: undefined,
        phone: undefined,
        isPrimary: false,
        isPlusOne: true,
      });
    }

    try {
      const result = await createHousehold({
        displayName: `${firstName} ${lastName}`,
        notes: notes || undefined,
        guests,
      });

      setCreatedToken(result.rsvpToken);
    } catch (err: any) {
      setError(err.message || 'Failed to create guest');
      setSubmitting(false);
    }
  };

  if (createdToken) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const rsvpUrl = `${siteUrl}/rsvp?t=${createdToken}`;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-2xl font-bold mb-4 text-sage-900">Guest Added!</h3>
          <p className="text-muted-foreground mb-6">
            The guest has been added. Send them this RSVP link:
          </p>

          <div className="bg-sage-50 p-4 rounded-lg mb-6 border border-sage-100 flex flex-col items-center">
            <p className="text-sm font-medium mb-2 text-sage-800">RSVP Link:</p>
            <code className="text-xs break-all block bg-white p-3 rounded border border-sage-200 text-primary w-full">
              {rsvpUrl}
            </code>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6 flex gap-3 items-start text-left">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-yellow-900">
              <strong>Save this link!</strong> It won't be shown again. You should send this link to the guest in their invitation.
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
      <div className="bg-white rounded-lg max-w-2xl w-full p-8 my-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-sage-900">Add New Guest</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="input"
                placeholder="John"
              />
            </div>
            <div>
              <label className="label block mb-2">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="input"
                placeholder="Smith"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-2">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="label block mb-2">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
                placeholder="+351 ..."
              />
            </div>
          </div>

          <div className="bg-sage-50 p-6 rounded-xl border border-sage-100 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="manual-has-plus-one"
                checked={hasPlusOne}
                onChange={(e) => setHasPlusOne(e.target.checked)}
                className="w-5 h-5 text-primary rounded border-sage-300 focus:ring-primary transition-colors cursor-pointer"
              />
              <label htmlFor="manual-has-plus-one" className="text-sm font-semibold text-sage-900 cursor-pointer">
                This guest has a Plus One
              </label>
            </div>

            {hasPlusOne && (
              <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-sage-200">
                <div>
                  <label className="label block mb-2 text-xs">Plus One First Name (optional)</label>
                  <input
                    type="text"
                    value={plusOneFirstName}
                    onChange={(e) => setPlusOneFirstName(e.target.value)}
                    className="input bg-white"
                    placeholder="Jane (leave empty if unknown)"
                  />
                </div>
                <div>
                  <label className="label block mb-2 text-xs">Plus One Last Name (optional)</label>
                  <input
                    type="text"
                    value={plusOneLastName}
                    onChange={(e) => setPlusOneLastName(e.target.value)}
                    className="input bg-white"
                    placeholder="Doe"
                  />
                </div>
                <p className="md:col-span-2 text-xs text-sage-600 italic">
                  Note: If names are left empty, the guest will be asked to provide them during RSVP.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="label block mb-2 text-sm">Notes (internal)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input"
              placeholder="Friend from university, etc."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !firstName || !lastName}
              className="btn-primary flex-1"
            >
              {submitting ? 'Adding...' : 'Add Guest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
