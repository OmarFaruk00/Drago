import AdminRootLayout from "@/components/admin/AdminRootLayout";

export const metadata = {
  title: "Admin - Drago Store",
  description: "Admin dashboard",
};

export default function Layout({ children }) {
  return <AdminRootLayout>{children}</AdminRootLayout>;
}
