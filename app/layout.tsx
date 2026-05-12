import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unitycup.com"),
  title: "The Unity Directory · Eat, meet, cheer them on",
  description:
    "A diaspora-food directory of Nigerian, Jamaican, Zimbabwean and Indian restaurants, bars and meet-ups around Unity Cup 2026.",
  openGraph: {
    title: "The Unity Directory",
    description:
      "A diaspora-food directory of Nigerian, Jamaican, Zimbabwean and Indian restaurants, bars and meet-ups around Unity Cup 2026.",
    images: ["/images/unitycup2.avif"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Unity Directory",
    description:
      "A diaspora-food directory of Nigerian, Jamaican, Zimbabwean and Indian restaurants, bars and meet-ups around Unity Cup 2026.",
    images: ["/images/unitycup2.avif"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          // Set theme before paint to avoid a flash.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('tud-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
