# Admin Panel – কিভাবে কাজ করবেন

লগইন: `/admin` এ গিয়ে email ও password দিয়ে login করুন।

---

## 1. Dashboard
- **পথ:** Admin → Dashboard
- **কাজ:** Overview – pending orders, recent activity, quick stats

---

## 2. Orders (অর্ডার ম্যানেজমেন্ট)
- **পথ:** Admin → Orders
- **কাজ:**
  - সব অর্ডার দেখুন
  - অর্ডার filter করুন (status দিয়ে)
  - অর্ডার click করে details দেখুন (`/admin/orders/[id]`)
  - Status পরিবর্তন করুন: Pending → Confirmed → Processing → Shipping → Shipped → Delivered
  - **Export:** CSV download করুন (তালিকা)
  - Search দিয়ে অর্ডার খুঁজুন

---

## 3. Products (প্রোডাক্ট)
- **পথ:** Admin → Products
- **Add:** "Add Product" → একই পেজেই নতুন প্রোডাক্ট add ও edit করা যায়
- **Edit:** কোন product এ click করুন → `/admin/products/add/[id]` এ same form এ edit
- **কাজ:**
  - Name, description, price, discount price
  - Images upload (drag & drop বা Add File)
  - Category, subcategory
  - Size/Color options
  - Specifications, warranty, free shipping
  - Product code, brand
- **Export:** JSON format এ সব product download
- **Delete:** product এ delete option

---

## 4. Categories (ক্যাটাগরি)
- **পথ:** Admin → Categories
- **কাজ:**
  - Main category add/edit
  - Sub-category add (parent select করে)
  - Category image upload
  - "Add Category" / Edit link

---

## 5. Banners
- **পথ:** Admin → Banners
- **কাজ:** Hero/banner images add, edit, delete – home page এ দেখাবে

---

## 6. Flash Sale
- **পথ:** Admin → Flash Sale
- **কাজ:**
  - Start & End time সেট করুন
  - Banner logo upload (left side) – zoom 50–150%
  - Products select করুন (checkbox)
  - Save করুন
- End time পার হয়ে গেলে site এ flash sale hide হবে

---

## 7. Home Sections
- **পথ:** Admin → Home Sections
- **কাজ:** Home page এর sections on/off করুন (categories, top products, explore ইত্যাদি)

---

## 8. Testimonials
- **পথ:** Admin → Testimonials
- **কাজ:** Customer reviews/testimonials add, edit, delete

---

## 9. About Us
- **পথ:** Admin → About Us
- **কাজ:** About page এর content edit

---

## 10. Privacy & Policy
- **পথ:** Admin → Policy
- **কাজ:** Privacy/Policy page content edit

---

## 11. Contact Us
- **পথ:** Admin → Contact
- **কাজ:** Contact info (phone, email, address), "Find Us on Google Maps" link

---

## 12. Blog
- **পথ:** Admin → Blog
- **কাজ:**
  - নতুন post: Blog → Add / New
  - Edit: কোন post এ edit link
  - Title, content, image

---

## 13. Footer
- **পথ:** Admin → Footer
- **কাজ:**
  - Logo upload
  - Logo size, zoom
  - Copyright text
  - About text
  - Phone, email, address
  - Social links
  - Policy/Help links

---

## 14. Coupons
- **পথ:** Admin → Coupons
- **কাজ:** Coupon code create, edit – discount type, value, expiry

---

## 15. Customers
- **পথ:** Admin → Customers
- **কাজ:** Registered users তালিকা, details দেখুন

---

## 16. Reports
- **পথ:** Admin → Reports
- **কাজ:** Sales/revenue reports, date range দিয়ে

---

## 17. Inbox
- **পথ:** Admin → Inbox
- **কাজ:** Messages/contact form submissions

---

## 18. Delivery Settings
- **পথ:** Admin → Delivery Settings
- **কাজ:** Delivery charge, free shipping threshold ইত্যাদি

---

## 19. Tracking (GTM)
- **পথ:** Admin → Tracking Settings
- **কাজ:** Google Tag Manager ID সেট করুন

---

## 20. Personal Settings
- **পথ:** Admin → Settings (Personal Settings)
- **কাজ:**
  - Profile: নাম, ফোন, profile picture
  - **Change Password:** নিজের password পরিবর্তন – Current, New, Confirm দিয়ে Save
  - Timezone, Language
  - Notification preferences

---

## সংক্ষিপ্ত Route Map

| মেনু | URL |
|------|-----|
| Dashboard | /admin |
| Orders | /admin/orders |
| Order Details | /admin/orders/[id] |
| Products | /admin/products |
| Add/Edit Product | /admin/products/add, /admin/products/add/[id] |
| Categories | /admin/categories |
| Banners | /admin/banners |
| Flash Sale | /admin/flash-sale |
| Home Sections | /admin/home-sections |
| Testimonials | /admin/testimonials |
| About | /admin/about |
| Policy | /admin/policy |
| Contact | /admin/contact |
| Blog | /admin/blog |
| Footer | /admin/footer |
| Coupons | /admin/coupons |
| Customers | /admin/customers |
| Reports | /admin/reports |
| Inbox | /admin/inbox |
| Delivery | /admin/delivery-settings |
| Tracking | /admin/tracking-settings |
| Settings | /admin/settings |
