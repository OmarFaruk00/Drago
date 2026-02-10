/**
 * Dummy dashboard data
 */

import { products } from "./products";

export const dashboardStats = {
  totalSales: "45,230 tk",
  orders: 128,
  products: 24,
};

export const recentActivities = [
  { id: "1", desc: "Order #1234 - Delivered", amount: "1,200 tk", status: "delivered" },
  { id: "2", desc: "Order #1235 - Shipped", amount: "890 tk", status: "shipped" },
  { id: "3", desc: "Order #1236 - Pending", amount: "2,100 tk", status: "pending" },
  { id: "4", desc: "Order #1237 - Processing", amount: "450 tk", status: "processing" },
];

export const wishlistItems = products.slice(0, 4);

export const shopProducts = products.slice(0, 6).map((p, i) => ({
  ...p,
  stock: [12, 5, 0, 8, 3, 15][i],
}));

export const orders = [
  { id: "1234", customer: "John Doe", date: "15 Apr 2024", total: "1,200 tk", status: "delivered" },
  { id: "1235", customer: "Jane Smith", date: "14 Apr 2024", total: "890 tk", status: "shipped" },
  { id: "1236", customer: "Alex Brown", date: "13 Apr 2024", total: "2,100 tk", status: "pending" },
  { id: "1237", customer: "Sarah Wilson", date: "12 Apr 2024", total: "450 tk", status: "processing" },
  { id: "1238", customer: "Mike Davis", date: "11 Apr 2024", total: "1,800 tk", status: "cancelled" },
];

export const orderDetails = {
  id: "1234",
  date: "15 April 2024",
  status: "delivered",
  items: [
    { ...products[0], quantity: 2, price: 49.99 },
    { ...products[1], quantity: 1, price: 199.99 },
  ],
  shipping: "123 Main St, Dhaka, Bangladesh",
  total: 299.97,
};
