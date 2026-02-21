import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AccountLayout from "@/components/account/AccountLayout";

export const metadata = {
  title: "Account - Drago Store",
  description: "Your account dashboard",
};

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/profile");
  }
  return <AccountLayout>{children}</AccountLayout>;
}
