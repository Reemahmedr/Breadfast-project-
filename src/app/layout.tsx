import type { Metadata } from "next";
import { Outfit, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import '@fortawesome/fontawesome-free/css/all.min.css';

const geistSans = Outfit({
  variable: "--font-outfit",
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
});

const geistMono = Raleway({
  variable: "--font-raleway",
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Breadfast - Fresh Groceries Delivered",
  description: "Order fresh groceries, bakery items, and daily essentials delivered to your door",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar></Navbar>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
