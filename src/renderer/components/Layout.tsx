

import { Outlet, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useShop } from '../context/ShopContext';

const Layout = () => {
    const { settings } = useShop();

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/items', label: 'Items' },
        { path: '/new-rental', label: 'New Rental' },
        { path: '/ongoing-rentals', label: 'Ongoing Rentals' },
        { path: '/renter-search', label: 'Renter Search' },
        { path: '/settings', label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-background font-sans text-text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r-4 border-border flex flex-col shrink-0 z-10">
                <div className="p-8 border-b-4 border-border bg-white">
                    <h1 className="font-display font-black text-3xl uppercase leading-none tracking-tighter">
                        {settings?.shopDisplayName || 'TECHRENT PRO'}
                    </h1>
                </div>
                <nav>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    'block px-6 py-4 font-display font-bold text-sm uppercase border-l-[8px] transition-all hover:bg-gray-100',
                                    isActive
                                        ? 'bg-accent text-white border-border'
                                        : 'border-transparent text-fg'
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 max-w-[1400px] overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
