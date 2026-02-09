/**
 * Mock inbox data when MongoDB is not connected
 */

export const mockConversations = [
  {
    id: "conv1",
    participant: { id: "u2", name: "John Doe", email: "john@example.com" },
    lastMessage: "When will my order arrive?",
    lastMessageAt: "2024-04-15T12:00:00Z",
    unread: 0,
  },
  {
    id: "conv2",
    participant: { id: "u3", name: "Jane Smith", email: "jane@example.com" },
    lastMessage: "Here is the product image you asked for",
    lastMessageAt: "2024-04-14T14:30:00Z",
    unread: 1,
  },
  {
    id: "conv3",
    participant: { id: "u4", name: "Lisa Anderson", email: "lisa@example.com" },
    lastMessage: "Thank you for the quick response!",
    lastMessageAt: "2024-04-13T09:15:00Z",
    unread: 0,
  },
];

export const mockMessages = {
  conv1: [
    { id: "m1", content: "Hi, I have a question about my order", sender: "user", createdAt: "2024-04-15T11:55:00Z" },
    { id: "m2", content: "Sure! What would you like to know?", sender: "admin", createdAt: "2024-04-15T11:56:00Z" },
    { id: "m3", content: "When will my order arrive?", sender: "user", createdAt: "2024-04-15T12:00:00Z" },
  ],
  conv2: [
    { id: "m4", content: "Can you show me a product image?", sender: "user", createdAt: "2024-04-14T14:00:00Z" },
    { id: "m5", content: "Here is the product image you asked for", sender: "user", attachment: "https://via.placeholder.com/200", createdAt: "2024-04-14T14:30:00Z" },
  ],
  conv3: [
    { id: "m6", content: "My package arrived safely.", sender: "user", createdAt: "2024-04-13T09:10:00Z" },
    { id: "m7", content: "Great to hear! Is there anything else we can help with?", sender: "admin", createdAt: "2024-04-13T09:12:00Z" },
    { id: "m8", content: "Thank you for the quick response!", sender: "user", createdAt: "2024-04-13T09:15:00Z" },
  ],
};
