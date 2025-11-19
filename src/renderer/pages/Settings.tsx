import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useShop } from '../context/ShopContext';

const TIMEZONES = [
    'Asia/Kolkata',
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
];

const Settings = () => {
    const { settings, updateSettings } = useShop();
    const [shopName, setShopName] = useState('');
    const [currency, setCurrency] = useState('');
    const [timezone, setTimezone] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setShopName(settings.shopDisplayName);
            setCurrency(settings.currency);
            setTimezone(settings.timezone);
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings({
                shopDisplayName: shopName,
                currency,
                timezone,
            });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        try {
            const success = await window.api.data.export();
            if (success) alert('Data exported successfully!');
            else alert('Export cancelled or failed.');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed');
        }
    };

    const handleImport = async (mode: 'add' | 'overwrite') => {
        if (mode === 'overwrite' && !confirm('WARNING: This will delete all existing data! Are you sure?')) {
            return;
        }

        try {
            const result = await window.api.data.import(mode);
            if (result.success) {
                alert(result.message);
                window.location.reload(); // Reload to reflect changes
            } else {
                alert(`Import failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Import failed:', error);
            alert('Import failed');
        }
    };

    if (!settings) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="font-display font-bold text-5xl uppercase tracking-tight mb-8">Settings</h2>

            <div className="grid grid-cols-2 gap-8">
                <Card title="Shop Configuration">
                    <Input
                        label="Shop Display Name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                    />
                    <Input
                        label="Currency (Symbol/Code)"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        placeholder="e.g. INR, USD, ₹"
                    />

                    <div className="mb-4">
                        <label className="block font-display font-bold text-xs uppercase mb-2">
                            Timezone
                        </label>
                        <select
                            className="w-full px-4 py-3 border-neo border-border bg-white font-sans focus:outline-none focus:border-accent transition-colors appearance-none"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                        >
                            {TIMEZONES.map((tz) => (
                                <option key={tz} value={tz}>{tz}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </Card>

                <Card title="Data Management">
                    <div className="mb-8">
                        <h3 className="font-bold mb-2 uppercase text-sm">Backup Data</h3>
                        <p className="text-sm text-gray-600 mb-4">Export all database records to an Excel file.</p>
                        <Button onClick={handleExport} variant="secondary">Export to Excel</Button>
                    </div>

                    <div className="border-t-2 border-border pt-6">
                        <h3 className="font-bold mb-2 uppercase text-sm">Import Data</h3>
                        <p className="text-sm text-gray-600 mb-4">Import records from an Excel file.</p>
                        <div className="flex gap-4">
                            <Button onClick={() => handleImport('add')} variant="secondary">Import (Add New)</Button>
                            <Button onClick={() => handleImport('overwrite')} className="bg-error text-white border-error hover:bg-red-600">Import (Overwrite)</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
