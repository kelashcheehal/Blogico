import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "BlogHub - Your Favorite Blog Platform",
  description: "Discover, read, and save your favorite blogs",
  generator: "v0.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
