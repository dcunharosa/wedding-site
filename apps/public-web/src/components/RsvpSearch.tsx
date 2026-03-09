'use client';

import { useState } from 'react';
import { searchRsvp } from '@/lib/api';

interface RsvpSearchProps {
    onSuccess: (token: string) => void;
}

export function RsvpSearch({ onSuccess }: RsvpSearchProps) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await searchRsvp(name.trim());
            onSuccess(result.token);
        } catch (err: any) {
            console.error('RSVP search error:', err);
            setError(
                err.status === 404
                    ? "We couldn't find an invitation matching that name. Please try again or check your spelling."
                    : 'An error occurred while searching. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl mb-2 text-center">Find Your Invitation</h3>
            <p className="text-charcoal/70 text-center mb-8">
                Please enter your name as it appears on your invitation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        First or Last Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        placeholder="e.g., Jane or Doe"
                        required
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
                >
                    {loading ? 'Searching...' : 'Continue to RSVP'}
                </button>
            </form>
        </div>
    );
}
