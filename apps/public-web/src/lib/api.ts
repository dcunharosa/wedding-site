// API client for the wedding site

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  // Ensure URL has protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

const API_URL = getApiUrl();

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
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'An error occurred',
      response.status,
      error
    );
  }

  return response.json();
}

// Public content API
export async function getContent(keys?: string[]) {
  const params = keys ? `?keys=${keys.join(',')}` : '';
  return fetchApi<Record<string, any>>(`/public/content${params}`);
}

// RSVP API
export async function getHouseholdRsvp(token: string) {
  return fetchApi<{
    id: string;
    displayName: string;
    guests: Array<{
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
    }>;
    extras?: {
      songRequestText?: string | null;
      songRequestSpotifyUrl?: string | null;
    };
    canEdit: boolean;
    deadlineInfo: {
      deadline: string;
      passed: boolean;
    };
  }>(`/public/rsvp/household?t=${token}`);
}

export async function submitRsvp(
  token: string,
  data: {
    responses: Array<{
      guestId: string;
      attending: boolean;
      dietaryRestrictions?: string | null;
    }>;
    songRequestText?: string | null;
    songRequestSpotifyUrl?: string | null;
  }
) {
  return fetchApi<{
    ok: boolean;
    submittedAt: string;
    corrected?: Array<{
      guestId: string;
      reason: string;
      correctedValue: boolean;
    }>;
  }>(`/public/rsvp/submit?t=${token}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitChangeRequest(token: string, message: string) {
  return fetchApi<{ ok: boolean }>(`/public/rsvp/change-request?t=${token}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
