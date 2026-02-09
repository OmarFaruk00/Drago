/**
 * Mock user data - Replace with MongoDB + authentication later
 * For demo: password is "password123" for all users (hashed in real app)
 */

export const mockUsers = [
  {
    id: "u1",
    email: "admin@store.com",
    password: "password123", // In production: use bcrypt hashed password
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01",
  },
  {
    id: "u2",
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    role: "user",
    phone: "+1 555-0101",
    createdAt: "2024-02-15",
  },
  {
    id: "u3",
    email: "jane@example.com",
    password: "password123",
    name: "Jane Smith",
    role: "user",
    phone: "+1 555-0102",
    createdAt: "2024-03-20",
  },
];
