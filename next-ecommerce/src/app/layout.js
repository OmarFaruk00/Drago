import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import StoreShell from "@/components/StoreShell";
import Providers from "@/components/Providers";
import FacebookPixelProvider from "@/components/tracking/FacebookPixelProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

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
        <Providers>
          <StoreShell>{children}</StoreShell>
        </Providers>
        {fbPixelId ? (
          <>
            <Script
              id="facebook-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${fbPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <FacebookPixelProvider />
          </>
        ) : null}
      </body>
    </html>
  );
}
