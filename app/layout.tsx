import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import AuthProvider from "@/context/authProvider";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True Feedback",
  description: "Anonymous AI-based feedback platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white min-h-screen`}
      >
        {/* <AuthProvider> */}
          {/* 🔥 Global Navigation */}
          <Navbar />

          {/* 🔥 Main Content */}
          <main className="pt-16 px-4 md:px-6">
            {children}
          </main>

          {/* 🔥 Sonner Global Notification */}
          <Toaster richColors closeButton />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
