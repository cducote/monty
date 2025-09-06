# Dog Harness & Leash Inventory App

A React Native Expo application for managing dog harness and leash inventory, built with TypeScript and Supabase.

## Features

- 📱 Cross-platform mobile app (iOS/Android)
- 🔍 Barcode scanning for product lookup
- 📊 Real-time inventory tracking
- 🚨 Low stock alerts
- 📈 Stock level management
- 🔗 Matching sets tracking (harness + leash combinations)

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend and database
- **React Query** for data fetching and caching
- **Expo Camera & Barcode Scanner** for barcode functionality

## Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add your Supabase project URL and API key
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   - Create a new Supabase project
   - Run the SQL schema from `plan.md` Phase 2
   - Set up Row Level Security policies

4. **Start Development**
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/
│   └── ui/           # Reusable UI components
├── screens/          # App screens
├── hooks/            # Custom React hooks
├── lib/              # Configuration and utilities
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Current Status

✅ **Completed:**
- Project setup and dependencies
- Folder structure
- TypeScript types for inventory
- Core UI components (Button, Card, Badge, Input)
- Custom hooks for products and inventory
- Supabase client configuration
- React Query setup

🚧 **Next Steps:**
- Set up Supabase database
- Create main navigation
- Build product management screens
- Implement barcode scanning
- Add inventory transaction screens

## UI Components

### Button
- Multiple variants (primary, secondary, danger)
- Loading states
- Disabled states

### Cards
- Generic Card component
- ProductCard with stock information
- Low stock visual indicators

### Badges
- Stock level indicators
- Multiple variants and sizes

### Inputs
- Text input with validation
- Number input with increment/decrement
- Form validation support

## Custom Hooks

### useProducts
- Fetch all products
- Filter by category
- CRUD operations

### useInventory
- Track inventory transactions
- Stock level management
- Low stock alerts

### useBarcode
- Barcode scanning functionality
- Product lookup by SKU
- SKU generation utilities

## Database Schema

The app uses the following main tables:
- `products` - Product information
- `product_variants` - Size/color/style variations
- `inventory_transactions` - Stock movements
- `suppliers` - Supplier information

## Contributing

1. Follow the implementation plan in `plan.md`
2. Use TypeScript for all new code
3. Follow the established component patterns
4. Add proper error handling
5. Test on both iOS and Android
