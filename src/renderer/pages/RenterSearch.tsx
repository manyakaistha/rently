import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { Rental } from '../../shared/types';

const RenterSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Rental[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        const data = await window.api.renters.search(query);
        setResults(data);
        setHasSearched(true);
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-display font-bold text-5xl uppercase tracking-tight mb-2">Renter Search</h2>
            </div>

            <div className="flex gap-4 mb-6">
                <Input
                    placeholder="SEARCH BY NAME OR PHONE"
                    className="w-96 mb-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>

            {hasSearched && (
                <Card title={`Results (${results.length})`}>
                    <table className="w-full border-collapse border-2 border-border">
                        <thead>
                            <tr>
                                <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Renter</th>
                                <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Date</th>
                                <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Status</th>
                                <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Total Price</th>
                                <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 border-2 border-border">
                                        No rentals found for this renter.
                                    </td>
                                </tr>
                            ) : (
                                results.map((rental) => (
                                    <tr key={rental.id} className="hover:bg-purple-50 border-l-8 border-transparent hover:border-accent transition-all">
                                        <td className="p-3 border-2 border-border font-bold">
                                            <div>{rental.renterName}</div>
                                            <div className="text-xs text-gray-500">{rental.renterPhone}</div>
                                        </td>
                                        <td className="p-3 border-2 border-border">{new Date(rental.rentDate).toLocaleDateString()}</td>
                                        <td className="p-3 border-2 border-border">
                                            <span className={`px-2 py-1 font-bold text-xs uppercase border-2 border-black ${rental.status === 'ongoing' ? 'bg-warning text-black' : 'bg-success text-black'
                                                }`}>
                                                {rental.status}
                                            </span>
                                        </td>
                                        <td className="p-3 border-2 border-border font-mono">₹{(rental.totalPriceAgreed / 100).toFixed(2)}</td>
                                        <td className="p-3 border-2 border-border text-sm">{rental.notes || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
};

export default RenterSearch;
