import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generator faktur",
  description: "Aplikacja do tworzenia faktur online.",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="pl" className="bg-white text-slate-900 antialiased light">
      <body className={inter.className}>
        <Providers>
          <Navbar />

          {authModal}

          <div className="container h-full pt-16">{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
