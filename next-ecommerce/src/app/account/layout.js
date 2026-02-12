import AccountLayout from "@/components/account/AccountLayout";

export const metadata = {
  title: "Account - Drago Store",
  description: "Your account dashboard",
};

export default function Layout({ children }) {
  return <AccountLayout>{children}</AccountLayout>;
}
