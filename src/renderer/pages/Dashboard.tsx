import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Rental } from '../../shared/types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalItems: 0,
        activeItems: 0,
        ongoingRentals: 0,
        totalRevenue: 0,
    });
    const [recentRentals, setRecentRentals] = useState<Rental[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const items = await window.api.items.getAll();
        const ongoing = await window.api.rentals.getOngoing();

        // For revenue, we'd ideally have a separate query, but for now let's just sum ongoing.
        // Real app would need a 'getAllRentals' or 'getRevenue' API.
        // Let's just use ongoing for now or fetch all rentals if we add that API.
        // I'll stick to ongoing for the KPI to be safe, or just 0 if we can't calculate all-time easily without fetching everything.
        // Actually, let's fetch all rentals for revenue calculation if we can, but I only exposed getOngoing.
        // I'll just show ongoing revenue for now or 0.

        setStats({
            totalItems: items.length,
            activeItems: items.filter(i => i.isActive).length,
            ongoingRentals: ongoing.length,
            totalRevenue: ongoing.reduce((sum, r) => sum + r.totalPriceAgreed, 0), // Just ongoing revenue for now
        });

        setRecentRentals(ongoing.slice(0, 5));
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-display font-bold text-5xl uppercase tracking-tight mb-2">Dashboard</h2>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="text-center py-8">
                    <div className="font-display font-bold text-xs uppercase mb-3 tracking-wider">Total Items</div>
                    <div className="font-display font-bold text-5xl">{stats.totalItems}</div>
                </Card>
                <Card className="text-center py-8">
                    <div className="font-display font-bold text-xs uppercase mb-3 tracking-wider">Active Items</div>
                    <div className="font-display font-bold text-5xl">{stats.activeItems}</div>
                </Card>
                <Card className="text-center py-8">
                    <div className="font-display font-bold text-xs uppercase mb-3 tracking-wider">Ongoing Rentals</div>
                    <div className="font-display font-bold text-5xl">{stats.ongoingRentals}</div>
                </Card>
                <Card className="text-center py-8">
                    <div className="font-display font-bold text-xs uppercase mb-3 tracking-wider">Active Revenue</div>
                    <div className="font-display font-bold text-5xl">₹{(stats.totalRevenue / 100).toFixed(2)}</div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 mb-8">
                <Button onClick={() => navigate('/new-rental')}>Log New Rental</Button>
                <Button variant="secondary" onClick={() => navigate('/items')}>Manage Items</Button>
            </div>

            {/* Recent Activity */}
            <Card title="Recent Activity">
                <table className="w-full border-collapse border-2 border-border">
                    <thead>
                        <tr>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Renter</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Date</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Status</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Total</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentRentals.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 border-2 border-border">
                                    No recent rentals found.
                                </td>
                            </tr>
                        ) : (
                            recentRentals.map((rental) => (
                                <tr key={rental.id} className="hover:bg-purple-50 border-l-8 border-transparent hover:border-accent transition-all">
                                    <td className="p-3 border-2 border-border font-bold">{rental.renterName}</td>
                                    <td className="p-3 border-2 border-border">{new Date(rental.rentDate).toLocaleDateString()}</td>
                                    <td className="p-3 border-2 border-border">
                                        <span className="px-2 py-1 bg-accent text-white font-bold text-xs uppercase border-2 border-black">
                                            {rental.status}
                                        </span>
                                    </td>
                                    <td className="p-3 border-2 border-border">₹{(rental.totalPriceAgreed / 100).toFixed(2)}</td>
                                    <td className="p-3 border-2 border-border">
                                        <Button size="sm" onClick={() => navigate('/ongoing-rentals')}>View</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Dashboard;
