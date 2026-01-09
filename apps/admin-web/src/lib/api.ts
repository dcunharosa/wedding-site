// Admin API client

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
    }

    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'An error occurred',
      response.status,
      error
    );
  }

  return response.json();
}

// Auth
export async function login(email: string, password: string) {
  const result = await fetchApi<{ accessToken: string; expiresIn: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );

  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', result.accessToken);
  }

  return result;
}

export async function getMe() {
  return fetchApi<{
    id: string;
    email: string;
    name: string;
    role: string;
  }>('/auth/me');
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  }
}

// Households
export async function getHouseholds(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status) query.append('status', params.status);
  if (params.page) query.append('page', params.page.toString());
  if (params.pageSize) query.append('pageSize', params.pageSize.toString());

  return fetchApi<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/admin/households?${query}`);
}

export async function getHousehold(id: string) {
  return fetchApi<any>(`/admin/households/${id}`);
}

export async function createHousehold(data: {
  displayName: string;
  notes?: string;
  guests: Array<{
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    isPrimary?: boolean;
    attendanceRequiresGuestId?: string;
  }>;
}) {
  return fetchApi<any>('/admin/households', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateHousehold(id: string, data: {
  displayName?: string;
  notes?: string;
}) {
  return fetchApi<any>(`/admin/households/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteHousehold(id: string) {
  return fetchApi<{ ok: boolean }>(`/admin/households/${id}`, {
    method: 'DELETE',
  });
}

// Audit logs
export async function getAuditLogs(params: {
  search?: string;
  action?: string;
  actorType?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.action) query.append('action', params.action);
  if (params.actorType) query.append('actorType', params.actorType);
  if (params.page) query.append('page', params.page.toString());
  if (params.pageSize) query.append('pageSize', params.pageSize.toString());

  return fetchApi<{
    items: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/admin/audit?${query}`);
}

// Dashboard stats (we'll add this endpoint to API)
export async function getDashboardStats() {
  // For now, derive from households
  const households = await getHouseholds({ pageSize: 1000 });

  let totalGuests = 0;
  let respondedHouseholds = 0;
  let attendingGuests = 0;
  let notAttendingGuests = 0;

  households.items.forEach((h: any) => {
    totalGuests += h.guests.length;
    if (h.rsvpLastSubmittedAt) {
      respondedHouseholds++;
    }
  });

  return {
    totalHouseholds: households.total,
    totalGuests,
    respondedHouseholds,
    notRespondedHouseholds: households.total - respondedHouseholds,
    attendingGuests,
    notAttendingGuests,
  };
}
