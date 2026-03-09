'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { createHouseholdsBulk } from '../lib/api';

interface ImportCsvModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface CsvRow {
    'First Name': string;
    'Last Name': string;
    'Email'?: string;
    'Phone'?: string;
    'Has Plus One'?: string;
    'Plus One First Name'?: string;
    'Plus One Last Name'?: string;
}

export function ImportCsvModal({ onClose, onSuccess }: ImportCsvModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<CsvRow>) => {
                const rows = results.data;
                const households: any[] = [];

                rows.forEach((row) => {
                    const firstName = row['First Name']?.trim();
                    const lastName = row['Last Name']?.trim();
                    if (!firstName || !lastName) return;

                    const household = {
                        displayName: `${firstName} ${lastName}`,
                        guests: [
                            {
                                firstName,
                                lastName,
                                email: row['Email']?.trim() || undefined,
                                phone: row['Phone']?.trim() || undefined,
                                isPrimary: true,
                                isPlusOne: false,
                            },
                        ],
                    };

                    const hasPlusOne = String(row['Has Plus One']).toLowerCase() === 'true';
                    if (hasPlusOne) {
                        household.guests.push({
                            firstName: row['Plus One First Name']?.trim() || 'Guest',
                            lastName: row['Plus One Last Name']?.trim() || 'Plus One',
                            email: undefined,
                            phone: undefined,
                            isPrimary: false,
                            isPlusOne: true,
                        });
                    }

                    households.push(household);
                });

                setPreview(households);
            },
            error: (err) => {
                setError(`Failed to parse CSV: ${err.message}`);
            },
        });
    };

    const handleImport = async () => {
        if (preview.length === 0) return;

        setImporting(true);
        setError(null);

        try {
            await createHouseholdsBulk(preview);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to import households');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Import Guests from CSV</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                        ×
                    </button>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {!file ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-sage-200 rounded-xl p-12 text-center cursor-pointer hover:bg-sage-50 transition-colors"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv"
                            className="hidden"
                        />
                        <div className="text-4xl mb-4">📄</div>
                        <p className="text-lg font-medium mb-1">Click to upload CSV</p>
                        <p className="text-sm text-muted-foreground">
                            Columns: First Name, Last Name, Email, Phone, Has Plus One, Plus One First Name, Plus One Last Name
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-sage-50 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {preview.length} guests found
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPreview([]);
                                }}
                                className="text-sm text-destructive hover:underline"
                            >
                                Change File
                            </button>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Guest</th>
                                        <th className="px-4 py-2 text-left">Guests</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {preview.slice(0, 10).map((h, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-2 font-medium">{h.displayName}</td>
                                            <td className="px-4 py-2">
                                                {h.guests.map((g: any) => `${g.firstName} ${g.lastName}`).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {preview.length > 10 && (
                                <div className="p-2 text-center bg-gray-50 text-xs text-muted-foreground border-t">
                                    And {preview.length - 10} more guests...
                                </div>
                            )}
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
                                onClick={handleImport}
                                disabled={importing}
                                className="btn-primary flex-1"
                            >
                                {importing ? 'Importing...' : `Import ${preview.length} Guests`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
