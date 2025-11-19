export interface Item {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    dailyRate: number;
    depositAmount: number | null;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface Rental {
    id: string;
    renterName: string;
    renterPhone: string | null;
    renterEmail: string | null;
    rentDate: number;
    expectedReturnDate: number | null;
    actualReturnDate: number | null;
    totalPriceAgreed: number;
    currency: string;
    status: 'ongoing' | 'returned' | 'lost' | 'damaged' | 'cancelled';
    notes: string | null;
    createdAt: number;
    updatedAt: number;
    items?: RentalItemWithDetails[];
}

export interface RentalItem {
    id: string;
    rentalId: string;
    itemId: string;
    quantity: number;
    pricePerUnit: number;
    subtotal: number;
}

export interface RentalItemWithDetails extends Partial<RentalItem> {
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    subtotal: number;
}

export interface ShopSettings {
    id: string;
    shopDisplayName: string;
    currency: string;
    timezone: string;
    createdAt: number;
    updatedAt: number;
}

export interface NewRentalData {
    renterName: string;
    renterPhone?: string;
    renterEmail?: string;
    rentDate: number;
    expectedReturnDate?: number;
    totalPriceAgreed: number;
    notes?: string;
    items: {
        itemId: string;
        quantity: number;
        pricePerUnit: number;
        subtotal: number;
    }[];
}
