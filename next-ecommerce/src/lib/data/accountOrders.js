/**
 * Fallback order data when API returns empty
 */

import { products } from "./products";

export const accountOrdersList = [
  { id: "02684", fullId: "ord-02684", date: "March 18, 2024", total: "$126.80 (5 Products)", status: "delivered" },
  { id: "02683", fullId: "ord-02683", date: "March 15, 2024", total: "$89.00 (2 Products)", status: "pending" },
  { id: "02682", fullId: "ord-02682", date: "March 12, 2024", total: "$245.00 (8 Products)", status: "delivered" },
  { id: "02681", fullId: "ord-02681", date: "March 10, 2024", total: "$54.99 (1 Product)", status: "cancelled" },
  { id: "02680", fullId: "ord-02680", date: "March 8, 2024", total: "$199.99 (3 Products)", status: "delivered" },
  { id: "02679", fullId: "ord-02679", date: "March 5, 2024", total: "$34.99 (1 Product)", status: "pending" },
  { id: "02678", fullId: "ord-02678", date: "March 3, 2024", total: "$156.00 (4 Products)", status: "cancelled" },
  { id: "02677", fullId: "ord-02677", date: "March 1, 2024", total: "$78.50 (2 Products)", status: "delivered" },
  { id: "02676", fullId: "ord-02676", date: "February 28, 2024", total: "$112.00 (3 Products)", status: "delivered" },
  { id: "02675", fullId: "ord-02675", date: "February 25, 2024", total: "$45.99 (1 Product)", status: "pending" },
];

export function getAccountOrderById(id) {
  const baseOrder = {
    id: String(id).slice(-6),
    fullId: id,
    date: "April 24, 2021",
    status: "delivered",
    billingAddress: {
      name: "Salma Russell",
      address: "88/B-Hunters Rd, Jatrabari\nNew Mexico, 28-34",
      email: "darin.russell@gmail.com",
      phone: "(917) 655-880",
    },
    shippingAddress: {
      name: "Salma Russell",
      address: "88/B-Hunters Rd, Jatrabari\nNew Mexico, 28-34",
      email: "darin.russell@gmail.com",
      phone: "(917) 655-880",
    },
    orderSummary: {
      orderId: "8462",
      paymentMethod: "Paypal",
      subtotal: 105,
      discountPercent: 20,
      shipping: 0,
      total: 84,
    },
    items: products.slice(0, 3).map((p, i) => ({
      ...p,
      quantity: [5, 2, 1][i] || 1,
    })),
  };
  return baseOrder;
}
