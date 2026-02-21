# Vercel Deployment Settings (Git Connected)

## 1. Project Configuration

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `next-ecommerce` *(যদি repo root এ Drago থাকে)* অথবা খালি *(যদি repo root ই next-ecommerce হয়)* |
| **Build Command** | `npm run build` |
| **Output Directory** | *(খালি রাখুন - Next.js auto)* |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x বা 20.x |

---

## 2. Environment Variables (Settings → Environment Variables)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | ✅ হ্যাঁ | Random secret (generate: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ হ্যাঁ | `https://drago-xi.vercel.app` |
| `MONGODB_URI` | ❌ না | MongoDB Atlas connection string। না দিলে dummy data use হবে |
| `JWT_SECRET` | ❌ না | Admin JWT এর জন্য (default আছে) |
| `GOOGLE_CLIENT_ID` | ❌ না | Google login এর জন্য |
| `GOOGLE_CLIENT_SECRET` | ❌ না | Google login এর জন্য |
| `FACEBOOK_CLIENT_ID` | ❌ না | Facebook login এর জন্য |
| `FACEBOOK_CLIENT_SECRET` | ❌ না | Facebook login এর জন্য |
| `NEXT_PUBLIC_USE_DUMMY_PRODUCTS` | ❌ না | `true` = dummy products use |

---

## 3. Root Directory কিভাবে set করবেন

Repo structure যদি এমন হয়:
```
Drago/
├── next-ecommerce/    ← App এখানে
│   ├── package.json
│   ├── src/
│   └── ...
└── README.md
```

তাহলে Vercel এ **Root Directory** এ লিখুন: `next-ecommerce`

যদি repo root ই next-ecommerce হয়, তাহলে Root Directory **খালি** রাখুন।

---

## 4. Git Integration

- **Production Branch:** `main` (default)
- **Preview Deployments:** সব branch এ auto
- **Auto Deploy:** main এ push করলে production এ deploy হবে

---

## 5. Optional: vercel.json

প্রয়োজন না হলে vercel.json লাগবে না। Next.js Vercel এ auto-detect হয়।
