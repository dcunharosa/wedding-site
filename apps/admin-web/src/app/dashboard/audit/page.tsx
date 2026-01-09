'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { getAuditLogs } from '../../../lib/api';

interface AuditLog {
  id: string;
  createdAt: string;
  actorType: 'ADMIN' | 'GUEST' | 'SYSTEM';
  actorAdmin?: {
    id: string;
    name: string;
    email: string;
  };
  household?: {
    id: string;
    displayName: string;
  };
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [actorTypeFilter, setActorTypeFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, [page, search, actionFilter, actorTypeFilter]);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await getAuditLogs({
        search: search || undefined,
        action: actionFilter || undefined,
        actorType: actorTypeFilter || undefined,
        page,
        pageSize: 50,
      });
      setLogs(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('SUBMITTED')) return 'bg-green-100 text-green-700';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-blue-100 text-blue-700';
    if (action.includes('LOGIN')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getActorIcon = (actorType: string) => {
    switch (actorType) {
      case 'ADMIN':
        return '👤';
      case 'GUEST':
        return '👥';
      case 'SYSTEM':
        return '🤖';
      default:
        return '❓';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">Audit Log</h2>
          <p className="text-muted-foreground mt-1">
            Track all actions and changes in the system
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label block mb-2">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search actions, entities..."
                className="input"
              />
            </div>
            <div>
              <label className="label block mb-2">Action Type</label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1);
                }}
                className="input"
              >
                <option value="">All Actions</option>
                <option value="ADMIN_LOGIN">Admin Login</option>
                <option value="HOUSEHOLD_CREATED">Household Created</option>
                <option value="HOUSEHOLD_UPDATED">Household Updated</option>
                <option value="HOUSEHOLD_DELETED">Household Deleted</option>
                <option value="RSVP_SUBMITTED">RSVP Submitted</option>
                <option value="CHANGE_REQUEST_CREATED">Change Request</option>
              </select>
            </div>
            <div>
              <label className="label block mb-2">Actor Type</label>
              <select
                value={actorTypeFilter}
                onChange={(e) => {
                  setActorTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="input"
              >
                <option value="">All Actors</option>
                <option value="ADMIN">Admin</option>
                <option value="GUEST">Guest</option>
                <option value="SYSTEM">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <div className="p-4 border-b">
            <p className="text-sm text-muted-foreground">
              Showing {logs.length} of {total} entries
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No audit logs found</p>
            </div>
          ) : (
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg">{getActorIcon(log.actorType)}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getActionBadgeColor(log.action)}`}>
                          {formatAction(log.action)}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground ml-8">
                        {log.actorType === 'ADMIN' && log.actorAdmin && (
                          <span>
                            <strong>{log.actorAdmin.name}</strong> ({log.actorAdmin.email})
                          </span>
                        )}
                        {log.actorType === 'GUEST' && log.household && (
                          <span>
                            Guest from <strong>{log.household.displayName}</strong>
                          </span>
                        )}
                        {log.actorType === 'SYSTEM' && (
                          <span>System action</span>
                        )}

                        {log.entityType && (
                          <span className="ml-2">
                            • {log.entityType}
                            {log.entityId && <span className="text-xs"> ({log.entityId.slice(0, 8)}...)</span>}
                          </span>
                        )}
                      </div>

                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-2 ml-8 text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                          <code>{JSON.stringify(log.metadata, null, 2)}</code>
                        </div>
                      )}
                    </div>

                    <div className="text-right text-sm text-muted-foreground">
                      <p>{new Date(log.createdAt).toLocaleDateString()}</p>
                      <p>{new Date(log.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 50 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(total / 50)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / 50)}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
