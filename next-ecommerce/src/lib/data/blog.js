/**
 * Dummy blog data
 */

export const blogPosts = [
  {
    id: "1",
    slug: "maecenas-tempor-urna-sed-quam-mollis",
    title: "Maecenas tempor urna sed quam mollis, a placerat du fringit suspendise",
    author: "Sabrina Haffner",
    date: "15 April 2024",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=450&fit=crop",
    contentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
  },
  {
    id: "2",
    slug: "sed-ut-perspiciatis-unde-omnis",
    title: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
    author: "John Doe",
    date: "10 April 2024",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    excerpt: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
  },
  {
    id: "3",
    slug: "neque-porro-quisquam-est-qui",
    title: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet",
    author: "Jane Smith",
    date: "5 April 2024",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=450&fit=crop",
    excerpt: "Consectetur, adipisci velit, sed quia non numquam eius modi.",
  },
];

export const comments = [
  { id: "1", name: "Michell Jhon", date: "15 April 2024", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Great post!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "2", name: "David Cooper", date: "14 April 2024", text: "Duis aute irure dolor in reprehenderit. Thanks for sharing!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "3", name: "Sarah Wilson", date: "13 April 2024", text: "Excepteur sint occaecat cupidatat non proident. Very informative.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: "4", name: "Alex Brown", date: "12 April 2024", text: "Sed ut perspiciatis unde omnis. Looking forward to more!", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
];

export const topCategories = [
  { name: "Electronics", count: 60 },
  { name: "Smartwatch", count: 50 },
  { name: "Headphone", count: 20 },
  { name: "Clothing", count: 45 },
  { name: "Fashion", count: 25 },
  { name: "Accessories", count: 15 },
  { name: "Mobile", count: 30 },
  { name: "Books", count: 12 },
];

export const popularTags = ["Game", "Electronics", "Mobile", "Gadgets", "Laptop", "Headphone", "Tv", "Camera", "Smartphone"];
