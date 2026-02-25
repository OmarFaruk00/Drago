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

The app uses **MongoDB** for products, orders, admin, coupons, categories. Without `MONGODB_URI`, product/order data will be empty.

1. Install dependencies: `npm install` (includes mongoose)
2. Create `.env.local` with:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/drago-store
   ```
3. Seed data: run `npm run seed:admin`, then `npm run seed`, `npm run seed:categories`, `npm run seed:coupons` as needed (see [SEED.md](./SEED.md))
4. Restart the dev server

### Folder Structure for MongoDB

- `src/lib/models/` - Mongoose models (Product, User, Cart)
- `src/lib/db/mongodb.js` - Connection utility (cached for serverless)
- `src/lib/services/` - Service layer (uses dummy OR MongoDB based on `MONGODB_URI`)
- `src/app/api/` - API routes call services

### Demo Login

- Admin: `admin@store.com` / `password123` (or use your own after seed — see [SEED.md](./SEED.md))
- User: register from site or use MongoDB users

---

## Admin Panel — কি কি করতে পারবেন ও কিভাবে

অ্যাডমিন প্যানেল সাইটের ব্যাকঅফিস। লগইন করে প্রোডাক্ট, অর্ডার, কুপন, ব্যানার ইত্যাদি ম্যানেজ করতে পারবেন।

### কিভাবে অ্যাডমিন লগইন করবেন

1. ব্রাউজারে যান: **`/admin`** (যেমন: `https://yoursite.com/admin`)
2. ইমেইল ও পাসওয়ার্ড দিন (প্রথম অ্যাডমিন অ্যাকাউন্ট সিড দিয়ে তৈরি করতে হয়)
3. প্রথম অ্যাডমিন তৈরি: `.env.local` এ `ADMIN_EMAIL` ও `ADMIN_PASSWORD` সেট করে `npm run seed:admin` চালান। বিস্তারিত [SEED.md](./SEED.md) তে।

### অ্যাডমিন কি কি করতে পারবেন

| মেনু | কি করা যায় | কিভাবে |
|------|-------------|--------|
| **Dashboard** | অর্ডার, সেলস, কাস্টমার সংখ্যা সহ সারাংশ দেখুন | `/admin` — লগইনের পর প্রথম পেজ |
| **Orders** | সব অর্ডার দেখুন, স্ট্যাটাস বদলান (pending → processing → shipped → delivered) | Orders এ ক্লিক → লিস্ট থেকে অর্ডার সিলেক্ট → স্ট্যাটাস আপডেট |
| **Products** | প্রোডাক্ট যোগ করুন, এডিট করুন, ডিলিট করুন | Products → Add New দিয়ে নতুন; লিস্ট থেকে Edit/Delete |
| **Categories** | ক্যাটাগরি যোগ/এডিট/ডিলিট (প্রোডাক্টে ব্যবহারের জন্য) | Categories → Add; লিস্ট থেকে Edit/Delete |
| **Banners** | হোমপেজ বা অন্য জায়গায় ব্যানার ইমেজ ও লিংক সেট করুন | Banners → Add/Edit — ইমেজ URL, লিংক, অর্ডার |
| **Footer** | ফুটার টেক্সট, ঠিকানা, ফোন, ইমেইল, সোশ্যাল লিংক এডিট করুন | Footer → ফিল্ড পূরণ করে সেভ |
| **Coupons** | কুপন কোড তৈরি (percentage/fixed/free shipping), লিমিট ও তারিখ সেট করুন; কাস্টমার-স্পেসিফিক কুপনও দিতে পারবেন | Coupons → Create; কোড, টাইপ, ভ্যালু, স্টার্ট/এন্ড ডেট, (ঐচ্ছিক) নির্দিষ্ট কাস্টমার ইমেইল |
| **Customers** | রেজিস্টার্ড কাস্টমার লিস্ট ও অর্ডার হিস্টরি দেখুন | Customers → লিস্ট ও ডিটেইল ভিউ |
| **Reports** | সেলস/অর্ডার রিপোর্ট ও ট্রেন্ড দেখুন | Reports পেজে চার্ট ও টেবিল |
| **Inbox** | কাস্টমার মেসেজ/চ্যাট UI (কনভারসেশন লিস্ট ও মেসেজ ভিউ) | Inbox → কনভারসেশন সিলেক্ট করে মেসেজ দেখুন |
| **Delivery Settings** | ডেলিভারি এরিয়া, চার্জ, নোট ম্যানেজ করুন | Delivery Settings → সেভ |
| **Personal Settings** | অ্যাডমিন প্রোফাইল (নাম, ইমেইল), পাসওয়ার্ড বদলান | Settings → প্রোফাইল ও পাসওয়ার্ড আপডেট করে সেভ |

### সংক্ষেপে

- **প্রোডাক্ট আপলোড:** Admin → **Products** → **Add New** — নাম, দাম, ইমেজ, ক্যাটাগরি, স্টক দিয়ে সেভ।
- **অর্ডার ম্যানেজ:** Admin → **Orders** — স্ট্যাটাস আপডেট করুন।
- **কুপন:** Admin → **Coupons** → Create — কোড ও নিয়ম সেট করুন; চেকআউটে কাস্টমার কোড ব্যবহার করবে।
- **সাইট কনটেন্ট:** **Banners** ও **Footer** দিয়ে হোম ও ফুটার কনটেন্ট কাস্টমাইজ করুন।

অ্যাডমিন যোগ/সেটআপের ধাপ: [SEED.md](./SEED.md) দেখুন।

---

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
