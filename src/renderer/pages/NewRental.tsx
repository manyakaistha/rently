import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import type { Item } from '../../shared/types';

interface CartItem {
    itemId: string;
    itemName: string;
    quantity: number;
    pricePerUnit: number; // cents
    subtotal: number; // cents
}

const NewRental: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    // Form State
    const [renterName, setRenterName] = useState('');
    const [renterPhone, setRenterPhone] = useState('');
    const [renterEmail, setRenterEmail] = useState('');
    const [rentDate, setRentDate] = useState(new Date().toISOString().split('T')[0]);
    const [expectedReturnDate, setExpectedReturnDate] = useState('');
    const [notes, setNotes] = useState('');

    // Item Selection State
    const [selectedItemId, setSelectedItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [priceOverride, setPriceOverride] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await window.api.items.getAll();
        setItems(data.filter(i => i.isActive));
    };

    const handleAddItem = () => {
        if (!selectedItemId) return;

        const item = items.find(i => i.id === selectedItemId);
        if (!item) return;

        const price = priceOverride ? Math.round(parseFloat(priceOverride) * 100) : item.dailyRate;
        const subtotal = price * quantity;

        setCart([...cart, {
            itemId: item.id,
            itemName: item.name,
            quantity,
            pricePerUnit: price,
            subtotal
        }]);

        // Reset selection
        setSelectedItemId('');
        setQuantity(1);
        setPriceOverride('');
    };

    const handleRemoveItem = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const handleSubmit = async () => {
        if (!renterName) {
            alert('Renter Name is required');
            return;
        }
        if (cart.length === 0) {
            alert('Please add at least one item');
            return;
        }

        try {
            await window.api.rentals.create({
                renterName,
                renterPhone: renterPhone || undefined,
                renterEmail: renterEmail || undefined,
                rentDate: new Date(rentDate).getTime(),
                expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate).getTime() : undefined,
                totalPriceAgreed: calculateTotal(),
                notes: notes || undefined,
                items: cart.map(i => ({
                    itemId: i.itemId,
                    quantity: i.quantity,
                    pricePerUnit: i.pricePerUnit,
                    subtotal: i.subtotal
                }))
            });

            alert('Rental created successfully!');
            navigate('/ongoing-rentals');
        } catch (error) {
            console.error(error);
            alert('Failed to create rental');
        }
    };

    // Update price placeholder when item selected
    const selectedItem = items.find(i => i.id === selectedItemId);
    const defaultPrice = selectedItem ? (selectedItem.dailyRate / 100).toFixed(2) : '';

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-display font-bold text-5xl uppercase tracking-tight mb-2">New Rental</h2>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Left Column: Renter Info & Dates */}
                <div className="col-span-1">
                    <Card title="Renter Info">
                        <Input
                            label="Renter Name *"
                            value={renterName}
                            onChange={(e) => setRenterName(e.target.value)}
                        />
                        <Input
                            label="Phone"
                            value={renterPhone}
                            onChange={(e) => setRenterPhone(e.target.value)}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={renterEmail}
                            onChange={(e) => setRenterEmail(e.target.value)}
                        />

                        <div className="border-t-2 border-border pt-4 mt-2">
                            <Input
                                label="Rent Date *"
                                type="date"
                                value={rentDate}
                                onChange={(e) => setRentDate(e.target.value)}
                            />
                            <Input
                                label="Expected Return"
                                type="date"
                                value={expectedReturnDate}
                                onChange={(e) => setExpectedReturnDate(e.target.value)}
                            />
                            <Input
                                label="Notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </Card>
                </div>

                {/* Right Column: Items & Cart */}
                <div className="col-span-2">
                    <Card title="Add Items">
                        <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-5">
                                <Select
                                    label="Select Item"
                                    options={items.map(i => ({ value: i.id, label: `${i.name} (${i.sku})` }))}
                                    value={selectedItemId}
                                    onChange={(e) => setSelectedItemId(e.target.value)}
                                    className="mb-0"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="Qty"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="mb-0"
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    label={`Price (₹) ${defaultPrice ? `(Def: ₹${defaultPrice})` : ''}`}
                                    type="number"
                                    step="0.01"
                                    value={priceOverride}
                                    onChange={(e) => setPriceOverride(e.target.value)}
                                    placeholder={defaultPrice}
                                    className="mb-0"
                                />
                            </div>
                            <div className="col-span-2 mb-4">
                                <label className="block font-display font-bold text-xs uppercase mb-2 invisible">Action</label>
                                <Button onClick={handleAddItem} className="w-full">Add</Button>
                            </div>
                        </div>
                    </Card>

                    <Card title="Cart">
                        <table className="w-full border-collapse border-2 border-border mb-6">
                            <thead>
                                <tr>
                                    <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Item</th>
                                    <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Qty</th>
                                    <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Price/Unit</th>
                                    <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Subtotal</th>
                                    <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 border-2 border-border">
                                            Cart is empty
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((item, index) => (
                                        <tr key={index} className="border-l-8 border-transparent">
                                            <td className="p-3 border-2 border-border font-bold">{item.itemName}</td>
                                            <td className="p-3 border-2 border-border">{item.quantity}</td>
                                            <td className="p-3 border-2 border-border">₹{(item.pricePerUnit / 100).toFixed(2)}</td>
                                            <td className="p-3 border-2 border-border">₹{(item.subtotal / 100).toFixed(2)}</td>
                                            <td className="p-3 border-2 border-border">
                                                <Button size="sm" variant="danger" onClick={() => handleRemoveItem(index)}>Remove</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center border-t-neo border-border pt-6">
                            <div className="text-3xl font-display font-bold uppercase">
                                Total: ₹{(calculateTotal() / 100).toFixed(2)}
                            </div>
                            <Button size="lg" onClick={handleSubmit}>Confirm Rental</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NewRental;
