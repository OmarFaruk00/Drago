import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Dashboard - Drago Store",
  description: "Your account dashboard",
};

export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
