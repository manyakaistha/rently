import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import type { Rental } from '../../shared/types';

const OngoingRentals: React.FC = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
    const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        const data = await window.api.rentals.getOngoing();
        setRentals(data);
    };

    const handleReturnClick = (rental: Rental) => {
        setSelectedRental(rental);
        setReturnDate(new Date().toISOString().split('T')[0]);
    };

    const handleConfirmReturn = async () => {
        if (!selectedRental) return;

        try {
            await window.api.rentals.markReturned(selectedRental.id, new Date(returnDate).getTime());
            setSelectedRental(null);
            loadRentals();
        } catch (error) {
            console.error(error);
            alert('Failed to mark rental as returned');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-display font-bold text-5xl uppercase tracking-tight mb-2">Ongoing Rentals</h2>
            </div>

            <Card>
                <table className="w-full border-collapse border-2 border-border">
                    <thead>
                        <tr>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Renter</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Contact</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Rent Date</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Expected Return</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Total Price</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 border-2 border-border">
                                    No ongoing rentals.
                                </td>
                            </tr>
                        ) : (
                            rentals.map((rental) => (
                                <tr key={rental.id} className="hover:bg-purple-50 border-l-8 border-transparent hover:border-accent transition-all">
                                    <td className="p-3 border-2 border-border font-bold">{rental.renterName}</td>
                                    <td className="p-3 border-2 border-border text-sm">
                                        <div>{rental.renterPhone}</div>
                                        <div className="text-gray-500">{rental.renterEmail}</div>
                                    </td>
                                    <td className="p-3 border-2 border-border">{new Date(rental.rentDate).toLocaleDateString()}</td>
                                    <td className="p-3 border-2 border-border">
                                        {rental.expectedReturnDate ? new Date(rental.expectedReturnDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-3 border-2 border-border font-mono">₹{(rental.totalPriceAgreed / 100).toFixed(2)}</td>
                                    <td className="p-3 border-2 border-border">
                                        <Button size="sm" variant="success" onClick={() => handleReturnClick(rental)}>Return</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            <Modal
                isOpen={!!selectedRental}
                onClose={() => setSelectedRental(null)}
                title="Return Rental"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedRental(null)}>Cancel</Button>
                        <Button onClick={handleConfirmReturn}>Confirm Return</Button>
                    </>
                }
            >
                <p className="mb-4">
                    Mark rental for <strong>{selectedRental?.renterName}</strong> as returned?
                </p>
                <Input
                    label="Actual Return Date"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default OngoingRentals;
