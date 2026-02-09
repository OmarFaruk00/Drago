/**
 * Mock order data for admin when MongoDB is not connected
 */

import { products } from "./products";

export const mockOrders = [
  {
    id: "ord1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { productId: "1", name: products[0].name, price: products[0].price, image: products[0].image, quantity: 2 },
      { productId: "2", name: products[1].name, price: products[1].price, image: products[1].image, quantity: 1 },
    ],
    total: 299.97,
    status: "delivered",
    shippingAddress: "123 Main St, Dhaka",
    createdAt: "2024-04-15",
  },
  {
    id: "ord2",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [
      { productId: "3", name: products[2].name, price: products[2].price, image: products[2].image, quantity: 1 },
    ],
    total: 89.99,
    status: "shipped",
    shippingAddress: "456 Oak Ave, Chittagong",
    createdAt: "2024-04-14",
  },
  {
    id: "ord3",
    customerName: "Alex Brown",
    customerEmail: "alex@example.com",
    items: [
      { productId: "4", name: products[3].name, price: products[3].price, image: products[3].image, quantity: 2 },
      { productId: "5", name: products[4].name, price: products[4].price, image: products[4].image, quantity: 1 },
    ],
    total: 294.97,
    status: "pending",
    shippingAddress: "789 Park Rd, Sylhet",
    createdAt: "2024-04-13",
  },
  {
    id: "ord4",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    items: [
      { productId: "6", name: products[5].name, price: products[5].price, image: products[5].image, quantity: 3 },
    ],
    total: 74.97,
    status: "processing",
    shippingAddress: "321 Lake St, Rajshahi",
    createdAt: "2024-04-12",
  },
  {
    id: "ord5",
    customerName: "Mike Davis",
    customerEmail: "mike@example.com",
    items: [
      { productId: "7", name: products[6].name, price: products[6].price, image: products[6].image, quantity: 1 },
    ],
    total: 39.99,
    status: "cancelled",
    shippingAddress: "555 Hill Ave, Khulna",
    createdAt: "2024-04-11",
  },
];
