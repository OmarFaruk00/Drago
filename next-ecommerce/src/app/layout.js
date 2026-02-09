import localFont from "next/font/local";
import "./globals.css";
import StoreShell from "@/components/StoreShell";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "Drago Store - Modern E-Commerce",
  description: "Shop electronics, fashion, sports, and home products at great prices",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
