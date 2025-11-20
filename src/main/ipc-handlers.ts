import { ipcMain } from 'electron';
import { db } from './db';
import { items, rentals, rentalItems, shopSettings } from './schema';
import { eq, like, desc, or, sql } from 'drizzle-orm';
import { ulid } from 'ulid';
import { exportToExcel, importFromExcel } from './excel';

export function registerIpcHandlers() {
    // --- Items ---
    ipcMain.handle('items:getAll', async () => {
        return db.select().from(items).orderBy(desc(items.createdAt)).all();
    });

    ipcMain.handle('items:create', async (_, data) => {
        const id = ulid();
        const now = Date.now();
        const newItem = {
            id,
            ...data,
            stock: data.stock || 0,
            createdAt: now,
            updatedAt: now,
        };
        db.insert(items).values(newItem).run();
        return newItem;
    });

    ipcMain.handle('items:update', async (_, data) => {
        const { id, ...updates } = data;
        db.update(items)
            .set({ ...updates, updatedAt: Date.now() })
            .where(eq(items.id, id))
            .run();
        return true;
    });

    ipcMain.handle('items:search', async (_, query) => {
        const search = `%${query}%`;
        return db.select().from(items)
            .where(or(like(items.name, search), like(items.sku, search)))
            .all();
    });

    ipcMain.handle('items:delete', async (_, id) => {
        db.delete(items).where(eq(items.id, id)).run();
        return true;
    });

    // --- Rentals ---
    ipcMain.handle('rentals:create', async (_, data) => {
        const rentalId = ulid();
        const now = Date.now();

        const { items: rItems, ...rentalData } = data;

        // Transaction
        db.transaction((tx) => {
            // Check stock first
            for (const item of rItems) {
                const dbItem = tx.select().from(items).where(eq(items.id, item.itemId)).get();
                if (!dbItem) throw new Error(`Item not found: ${item.itemId}`);
                if (dbItem.stock < item.quantity) {
                    throw new Error(`Insufficient stock for item: ${dbItem.name}. Available: ${dbItem.stock}, Requested: ${item.quantity}`);
                }
            }

            // Create Rental
            tx.insert(rentals).values({
                id: rentalId,
                ...rentalData,
                createdAt: now,
                updatedAt: now,
            }).run();

            // Create Rental Items and Update Stock
            for (const item of rItems) {
                tx.insert(rentalItems).values({
                    id: ulid(),
                    rentalId,
                    itemId: item.itemId,
                    quantity: item.quantity,
                    pricePerUnit: item.pricePerUnit,
                    subtotal: item.subtotal,
                }).run();

                // Decrement stock
                tx.update(items)
                    .set({
                        stock: sql`stock - ${item.quantity}`,
                        updatedAt: now
                    })
                    .where(eq(items.id, item.itemId))
                    .run();
            }
        });

        return rentalId;
    });

    ipcMain.handle('rentals:getOngoing', async () => {
        // Get rentals with status 'ongoing'
        // We also need to fetch items for each rental to display count/details if needed
        // For the list view, we might just need the rental info + item count.
        // Drizzle's `with` or manual join.

        const ongoingRentals = db.select().from(rentals)
            .where(eq(rentals.status, 'ongoing'))
            .orderBy(desc(rentals.rentDate))
            .all();

        // Fetch items for these rentals
        // This is N+1 but for local SQLite it's fast enough for MVP. 
        // Optimization: single query with join.

        const results = [];
        for (const rental of ongoingRentals) {
            const rItems = db.select({
                itemName: items.name,
                quantity: rentalItems.quantity,
                pricePerUnit: rentalItems.pricePerUnit,
                subtotal: rentalItems.subtotal
            })
                .from(rentalItems)
                .leftJoin(items, eq(rentalItems.itemId, items.id))
                .where(eq(rentalItems.rentalId, rental.id))
                .all();

            results.push({ ...rental, items: rItems });
        }

        return results;
    });

    ipcMain.handle('rentals:markReturned', async (_, { id, returnDate }) => {
        db.transaction((tx) => {
            // Update rental status
            tx.update(rentals)
                .set({
                    status: 'returned',
                    actualReturnDate: returnDate,
                    updatedAt: Date.now()
                })
                .where(eq(rentals.id, id))
                .run();

            // Get items for this rental to restore stock
            const rItems = tx.select().from(rentalItems).where(eq(rentalItems.rentalId, id)).all();

            // Increment stock
            for (const item of rItems) {
                tx.update(items)
                    .set({
                        stock: sql`stock + ${item.quantity}`,
                        updatedAt: Date.now()
                    })
                    .where(eq(items.id, item.itemId))
                    .run();
            }
        });
        return true;
    });

    // --- Renters ---
    ipcMain.handle('renters:search', async (_, query) => {
        const search = `%${query}%`;
        // Find rentals matching name or phone
        const matches = db.select().from(rentals)
            .where(or(like(rentals.renterName, search), like(rentals.renterPhone, search)))
            .orderBy(desc(rentals.rentDate))
            .all();

        // Group/Dedupe logic can happen here or in frontend. 
        // For now return all matching rentals.

        // Enrich with items
        const results = [];
        for (const rental of matches) {
            const rItems = db.select({
                itemName: items.name,
                quantity: rentalItems.quantity,
                pricePerUnit: rentalItems.pricePerUnit,
                subtotal: rentalItems.subtotal
            })
                .from(rentalItems)
                .leftJoin(items, eq(rentalItems.itemId, items.id))
                .where(eq(rentalItems.rentalId, rental.id))
                .all();
            results.push({ ...rental, items: rItems });
        }

        return results;
    });

    // --- Settings ---
    ipcMain.handle('settings:get', async () => {
        let settings = db.select().from(shopSettings).where(eq(shopSettings.id, 'singleton')).get();
        if (!settings) {
            // Initialize default settings
            const now = Date.now();
            settings = {
                id: 'singleton',
                shopDisplayName: 'My Rental Shop',
                currency: 'INR',
                timezone: 'Asia/Kolkata',
                createdAt: now,
                updatedAt: now,
            };
            db.insert(shopSettings).values(settings).run();
        }
        return settings;
    });

    ipcMain.handle('settings:update', async (_, data) => {
        db.update(shopSettings)
            .set({ ...data, updatedAt: Date.now() })
            .where(eq(shopSettings.id, 'singleton'))
            .run();
        return true;
    });

    // --- Data ---
    ipcMain.handle('data:export', async () => {
        return await exportToExcel();
    });

    ipcMain.handle('data:import', async (_, mode) => {
        return await importFromExcel(mode);
    });
}
