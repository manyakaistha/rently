import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    sku: text('sku').notNull().unique(),
    description: text('description'),
    dailyRate: integer('daily_rate').notNull(), // cents
    depositAmount: integer('deposit_amount'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

export const rentals = sqliteTable('rentals', {
    id: text('id').primaryKey(),
    renterName: text('renter_name').notNull(),
    renterPhone: text('renter_phone'),
    renterEmail: text('renter_email'),
    rentDate: integer('rent_date').notNull(),
    expectedReturnDate: integer('expected_return_date'),
    actualReturnDate: integer('actual_return_date'),
    totalPriceAgreed: integer('total_price_agreed').notNull(),
    currency: text('currency').notNull().default('USD'),
    status: text('status').notNull().default('ongoing'),
    notes: text('notes'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

export const rentalItems = sqliteTable('rental_items', {
    id: text('id').primaryKey(),
    rentalId: text('rental_id').notNull().references(() => rentals.id),
    itemId: text('item_id').notNull().references(() => items.id),
    quantity: integer('quantity').notNull(),
    pricePerUnit: integer('price_per_unit').notNull(),
    subtotal: integer('subtotal').notNull(),
});

export const shopSettings = sqliteTable('shop_settings', {
    id: text('id').primaryKey().default('singleton'),
    shopDisplayName: text('shop_display_name').notNull(),
    currency: text('currency').notNull().default('USD'),
    timezone: text('timezone').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
});

export const auditLog = sqliteTable('audit_log', {
    id: text('id').primaryKey(),
    entity: text('entity').notNull(),
    entityId: text('entity_id').notNull(),
    action: text('action').notNull(),
    user: text('user').notNull().default('admin'),
    beforeJSON: text('before_json'),
    afterJSON: text('after_json'),
    timestamp: integer('timestamp').notNull(),
});
