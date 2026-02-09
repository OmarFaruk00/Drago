/**
 * Hierarchical categories for sidebar - All Categories expandable
 */

export const sidebarCategories = [
  {
    id: "electronics",
    name: "Electronics",
    count: 24,
    children: [
      { name: "Mobile", slug: "Electronics", count: 10, brands: ["Samsung", "Xiaomi", "Apple"] },
      { name: "Headphones", slug: "Electronics", count: 6 },
      { name: "Laptop", slug: "Electronics", count: 4 },
      { name: "Watch", slug: "Electronics", count: 4 },
    ],
  },
  {
    id: "fashion",
    name: "Fashions",
    count: 18,
    children: [
      { name: "Men", slug: "Fashion", count: 8 },
      { name: "Women", slug: "Fashion", count: 10 },
    ],
  },
  {
    id: "home",
    name: "Home & Garden",
    count: 12,
    children: [
      { name: "Furniture", slug: "Home", count: 5 },
      { name: "Decor", slug: "Home", count: 7 },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    count: 8,
    children: [
      { name: "Fitness", slug: "Sports", count: 4 },
      { name: "Outdoor", slug: "Sports", count: 4 },
    ],
  },
];

export const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#eab308" },
  { name: "Orange", value: "#f97316" },
  { name: "Purple", value: "#a855f7" },
];

export const sizes = ["S", "M", "L", "XL", "XXL"];

export const brands = ["Samsung", "Xiaomi", "Apple", "Google", "Oppo", "Vivo", "Realme", "OnePlus", "Motorola", "Sony"];
