# ডাটাবেস সিড – কিভাবে চালাবেন

সাইট শুধু MongoDB দিয়ে চলে। প্রথমবার ডাটাবেসে অ্যাডমিন, ক্যাটাগরি, প্রোডাক্ট, কুপন সিড দিয়ে ঢুকাতে পারেন।

## আগে যা লাগবে

1. **MongoDB** – Atlas বা লোকাল। Connection string টা `.env.local` এ দিন:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/drago-store
   ```

2. **প্রজেক্ট ফোল্ডার** – টার্মিনালে `next-ecommerce` ফোল্ডারে যান:
   ```bash
   cd next-ecommerce
   ```

---

## সিড চালানোর কমান্ড

### ১. অ্যাডমিন ইউজার (প্রথমে এটা চালান)

```bash
npm run seed:admin
```

- ডিফল্ট লগইন: **admin@store.com** / **password123**
- **কোনো ইমেইল (যেমন ক্লায়েন্টের) অ্যাডমিন করতে:** `.env.local` এ যোগ করুন:
  ```
  ADMIN_EMAIL=fardinislamniloy98@gmail.com
  ADMIN_PASSWORD=ক্লায়েন্টের_পাসওয়ার্ড_বা_আপনি_দেবেন
  ADMIN_NAME=Admin
  ```
  তারপর আবার চালান: `npm run seed:admin`
- অথবা একবারের জন্য টার্মিনালে (PowerShell):
  ```powershell
  cd next-ecommerce
  $env:ADMIN_EMAIL="fardinislamniloy98@gmail.com"
  $env:ADMIN_PASSWORD="একটা_শক্ত_পাসওয়ার্ড_দিন"
  npm run seed:admin
  ```
  লগইন: **fardinislamniloy98@gmail.com** + ওই পাসওয়ার্ড। ক্লায়েন্ট পরে অ্যাডমিন প্রোফাইল থেকে পাসওয়ার্ড বদলাতে পারবে।

### ২. ক্যাটাগরি

```bash
npm run seed:categories
```

- Electronics, Fashion, Home – এই ৩টা ক্যাটাগরি ঢুকবে। পরে অ্যাডমিন প্যানেল থেকে এডিট/অ্যাড করতে পারবেন।

### ৩. প্রোডাক্ট

```bash
npm run seed
```

- ২টা স্যাম্পল প্রোডাক্ট ঢুকবে। বাকি প্রোডাক্ট অ্যাডমিন প্যানেল থেকে যোগ করুন।

### ৪. কুপন (ঐচ্ছিক)

```bash
npm run seed:coupons
```

- WELCOME10 (১০ টাকা অফ), FREESHIP (ফ্রি ডেলিভারি) – ২টা কুপন ঢুকবে।

---

## একসাথে সব সিড চালাতে চাইলে

```bash
cd next-ecommerce
npm run seed:admin
npm run seed:categories
npm run seed
npm run seed:coupons
```

এরপর সাইট চালু করে অ্যাডমিন প্যানেলে লগইন করে বাকি প্রোডাক্ট/ক্যাটাগরি/কুপন যোগ করতে পারবেন।
