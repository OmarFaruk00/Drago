# Drago Store - Next.js E-Commerce

Modern e-commerce website built with Next.js 14, React, Tailwind CSS, and Zustand.

## Features

- **Pages:** Home, Products, Product Details, Cart, Checkout, Login, Register, Admin Dashboard
- **Components:** Navbar, Footer, ProductCard, CartItem, ProductFilterSidebar
- **State:** Zustand (cart + user)
- **API:** Products, Cart, Users - ready for MongoDB

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Zustand
- Mongoose (ready for MongoDB)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## MongoDB Integration

By default, the app uses **dummy JSON data**. To switch to MongoDB:

1. Install dependencies: `npm install` (includes mongoose)
2. Create `.env.local` with:
   ```
   MONGODB_URI=mongodb://localhost:27017/drago-store
   ```
3. Seed products: `npm run seed` to insert dummy products into MongoDB
4. Restart the dev server

### Folder Structure for MongoDB

- `src/lib/models/` - Mongoose models (Product, User, Cart)
- `src/lib/db/mongodb.js` - Connection utility (cached for serverless)
- `src/lib/services/` - Service layer (uses dummy OR MongoDB based on `MONGODB_URI`)
- `src/app/api/` - API routes call services

### Demo Login

- Admin: `admin@store.com` / `password123`
- User: `john@example.com` / `password123`

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin dashboard
│   ├── cart/         # Cart page
│   ├── checkout/     # Checkout page
│   ├── login/        # Login page
│   ├── products/     # Product listing & details
│   └── register/     # Register page
├── components/       # Reusable UI
├── lib/
│   ├── config.js     # USE_MONGODB flag
│   ├── data/         # Dummy JSON (products, users)
│   ├── db/           # MongoDB connection
│   ├── models/       # Mongoose schemas
│   ├── services/     # Product, User, Cart services
│   └── store/        # Zustand store
```
