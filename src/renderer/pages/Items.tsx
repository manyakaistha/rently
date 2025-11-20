import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import type { Item } from '../../shared/types';

const Items: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        description: '',
        dailyRate: '',
        depositAmount: '',
        stock: '',
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await window.api.items.getAll();
        setItems(data);
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            loadItems();
            return;
        }
        const data = await window.api.items.search(search);
        setItems(data);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            await window.api.items.delete(id);
            loadItems();
        }
    };

    const openEditModal = (item: Item) => {
        setEditingItem(item);
        setNewItem({
            name: item.name,
            sku: item.sku,
            description: item.description || '',
            dailyRate: (item.dailyRate / 100).toString(),
            depositAmount: item.depositAmount ? (item.depositAmount / 100).toString() : '',
            stock: item.stock.toString(),
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setNewItem({ name: '', sku: '', description: '', dailyRate: '', depositAmount: '', stock: '' });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!newItem.name || !newItem.sku || !newItem.dailyRate) {
            alert('Please fill in required fields (Name, SKU, Daily Rate)');
            return;
        }

        const rate = parseFloat(newItem.dailyRate);
        if (isNaN(rate)) {
            alert('Daily Rate must be a valid number');
            return;
        }

        const deposit = newItem.depositAmount ? parseFloat(newItem.depositAmount) : 0;
        if (newItem.depositAmount && isNaN(deposit)) {
            alert('Deposit Amount must be a valid number');
            return;
        }

        const stock = newItem.stock ? parseInt(newItem.stock) : 0;
        if (newItem.stock && isNaN(stock)) {
            alert('Stock must be a valid number');
            return;
        }

        try {
            const itemData = {
                name: newItem.name,
                sku: newItem.sku,
                description: newItem.description || null,
                dailyRate: Math.round(rate * 100), // Convert to cents
                depositAmount: newItem.depositAmount ? Math.round(deposit * 100) : null,
                stock: stock,
                isActive: true,
            };

            if (editingItem) {
                await window.api.items.update({ ...itemData, id: editingItem.id });
            } else {
                await window.api.items.create(itemData);
            }

            setIsModalOpen(false);
            setEditingItem(null);
            setNewItem({ name: '', sku: '', description: '', dailyRate: '', depositAmount: '', stock: '' });
            loadItems();
        } catch (error) {
            console.error('Failed to save item:', error);
            alert(`Failed to save item: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-display font-bold text-5xl uppercase tracking-tight mb-6">Items</h2>

                <div className="flex gap-4">
                    <Input
                        placeholder="SEARCH BY NAME OR SKU"
                        className="w-96 mb-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                    <Button onClick={openCreateModal}>Add Item</Button>
                </div>
            </div>

            <Card>
                <table className="w-full border-collapse border-2 border-border">
                    <thead>
                        <tr>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Name</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">SKU</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Daily Rate</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Deposit</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Stock</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Status</th>
                            <th className="bg-purple-100 p-3 text-left border-2 border-border font-display font-bold text-xs uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 border-2 border-border">
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-purple-50 border-l-8 border-transparent hover:border-accent transition-all">
                                    <td className="p-3 border-2 border-border font-bold">{item.name}</td>
                                    <td className="p-3 border-2 border-border font-mono text-sm">{item.sku}</td>
                                    <td className="p-3 border-2 border-border">₹{(item.dailyRate / 100).toFixed(2)}</td>
                                    <td className="p-3 border-2 border-border">{item.depositAmount ? `₹${(item.depositAmount / 100).toFixed(2)}` : '-'}</td>
                                    <td className="p-3 border-2 border-border font-mono">{item.stock}</td>
                                    <td className="p-3 border-2 border-border">
                                        <span className={`px-2 py-1 font-bold text-xs uppercase border-2 border-black ${item.isActive ? 'bg-success text-black' : 'bg-error text-white'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-3 border-2 border-border">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => openEditModal(item)}>Edit</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Item" : "Add New Item"}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>{editingItem ? "Update Item" : "Save Item"}</Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Item Name *"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <Input
                        label="SKU *"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    />
                </div>
                <Input
                    label="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Daily Rate (₹) *"
                        type="number"
                        step="0.01"
                        value={newItem.dailyRate}
                        onChange={(e) => setNewItem({ ...newItem, dailyRate: e.target.value })}
                    />
                    <Input
                        label="Deposit Amount (₹)"
                        type="number"
                        step="0.01"
                        value={newItem.depositAmount}
                        onChange={(e) => setNewItem({ ...newItem, depositAmount: e.target.value })}
                    />
                </div>
                <Input
                    label="Stock Quantity"
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                />
            </Modal>
        </div>
    );
};

export default Items;
