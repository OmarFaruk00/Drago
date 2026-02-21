# MongoDB Connect করার ধাপ

## 1. MongoDB Atlas (Cloud) দিয়ে Connect

### Step 1: Account তৈরি করুন
- https://www.mongodb.com/cloud/atlas এ যান
- **Try Free** ক্লিক করে একাউন্ট বানান
- Free tier (M0) বেছে নিন

### Step 2: Cluster তৈরি করুন
- **Build a Database** ক্লিক করুন
- **M0 FREE** সিলেক্ট করুন
- Region: আপনার কাছের (e.g. Mumbai/Singapore)
- **Create** ক্লিক করুন

### Step 3: Database User তৈরি করুন
- **Create Database User** এ:
  - Username: `drago` (বা আপনার পছন্দ)
  - Password: একটা শক্তিশালী পাসওয়ার্ড দিন
  - **Create User** ক্লিক করুন

### Step 4: Network Access দিন
- **Add My Current IP Address** ক্লিক করুন (অথবা `0.0.0.0/0` দিয়ে সব জায়গা থেকে অ্যাক্সেস দিন - শুধু development এর জন্য)
- **Finish and Close** ক্লিক করুন

### Step 5: Connection String কপি করুন
- **Connect** বাটনে ক্লিক করুন
- **Drivers** সিলেক্ট করুন
- **Node.js** বেছে নিন
- Connection string এর মতো দেখাবে:
```
mongodb+srv://drago:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: .env.local এ add করুন
`next-ecommerce/.env.local` ফাইলে যোগ করুন:

```
MONGODB_URI=mongodb+srv://drago:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/drago-store?retryWrites=true&w=majority
```

**মনে রাখবেন:**
- `<password>` এর জায়গায় আপনার actual password দিন
- Password এ special character (যেমন @, #) থাকলে URL encode করুন:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`

---

## 2. Local MongoDB দিয়ে Connect

যদি আপনার কম্পিউটারে MongoDB installed থাকে:

```
MONGODB_URI=mongodb://localhost:27017/drago-store
```

---

## 3. Seed Data লোড করা (Optional)

MongoDB connect হওয়ার পর products, admin, categories seed করতে:

```bash
cd next-ecommerce
npm run seed
npm run seed:admin
npm run seed:categories
```

---

## 4. Verify করুন

1. `.env.local` এ MONGODB_URI সঠিকভাবে add করেছেন কিনা চেক করুন
2. Dev server restart করুন: `npm run dev`
3. Site open করুন – MongoDB connect হলে products API থেকে real data আসবে
4. Admin login করুন: `/admin` – seed করে থাকলে admin credentials কাজ করবে
