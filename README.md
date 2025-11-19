# 📦 Device Rental Manager

A modern, cross-platform desktop application for managing device rental businesses. Built with Electron, React, and TypeScript, featuring a neo-brutalist design aesthetic.

## ✨ Features

- **📊 Dashboard** - Real-time overview of active rentals, inventory, and revenue
- **📦 Inventory Management** - Track items with SKU, daily rates, deposits, and availability
- **🆕 New Rental Creation** - Intuitive multi-item rental creation with dynamic pricing
- **🔄 Ongoing Rentals** - Monitor active rentals with return date tracking
- **🔍 Renter Search** - Quick lookup of rental history by customer name or phone
- **⚙️ Settings** - Customize shop name, currency (₹ INR), and timezone
- **📤 Excel Export/Import** - Backup and restore data with full Excel support
- **🗄️ SQLite Database** - Fast, reliable local data storage
- **🎨 Neo-Brutalist UI** - Bold, modern design with "Darker Grotesque" typography

## 🛠️ Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) ^33.0.0
- **Frontend**: [React](https://react.dev/) ^19.2.0 + [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router](https://reactrouter.com/) v7
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Database**: [SQLite](https://www.sqlite.org/) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Packaging**: [electron-builder](https://www.electron.build/)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/device-rental-app.git
cd device-rental-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will launch in development mode with hot-reload enabled.

## 📦 Building for Production

### Build for Current Platform
```bash
npm run dist
```

### Build for Specific Platforms
```bash
# Windows (NSIS installer + portable)
npm run dist:win

# macOS (DMG + ZIP)
npm run dist:mac

# Linux (AppImage, .deb, .rpm)
npm run dist:linux
```

Installers will be created in the `release/` directory.

## 🗂️ Project Structure

```
device-rental-app/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   ├── db.ts          # Database initialization
│   │   ├── schema.ts      # Drizzle ORM schema
│   │   ├── ipc-handlers.ts # IPC communication
│   │   └── excel.ts       # Excel import/export
│   ├── preload/           # Preload scripts
│   │   └── preload.ts     # Context bridge
│   ├── renderer/          # React frontend
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (global state)
│   │   └── App.tsx        # Main React app
│   └── shared/            # Shared types
├── public/                # Static assets
├── dist/                  # Vite build output
├── dist-electron/         # Electron build output
└── release/               # Production installers
```

## 💾 Database Schema

The app uses SQLite with the following tables:

- **items** - Rental inventory (name, SKU, daily rate, deposit)
- **rentals** - Rental transactions (renter info, dates, status)
- **rentalItems** - Junction table for rental line items
- **shopSettings** - Shop configuration (name, currency, timezone)
- **auditLog** - Change history tracking

## 🎨 Design Philosophy

The app features a **neo-brutalist** design with:
- Bold, thick borders (`border-4`)
- Strong shadows (`shadow-neo`)
- High-contrast colors (purple accents, white backgrounds)
- "Darker Grotesque" display font
- Uppercase headings and labels

## 🌍 Localization

- **Currency**: Currently supports INR (₹) with easy customization
- **Timezone**: Configurable timezone for rental date tracking
- **Date Format**: ISO format with locale-aware display

## 📊 Data Management

### Export
Export all data (items, rentals, settings) to Excel:
```
Settings → Backup Data → Export to Excel
```

### Import
Import data from Excel with two modes:
- **Add New**: Append records (skips duplicates)
- **Overwrite**: Replace all data (creates automatic backup)

### Backups
Automatic backups are created before data overwrites in:
```
~/Library/Application Support/device-rental-app/backups/
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run pack         # Create unpacked build (testing)
npm run dist         # Create installer for current platform
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please open an issue on [GitHub Issues](https://github.com/yourusername/device-rental-app/issues).

---

Built with ❤️ using Electron and React
