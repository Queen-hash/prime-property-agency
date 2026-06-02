import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Menggunakan font Inter sesuai kriteria PDF
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prime Property",
  description: "Platform manajemen listing properti eksklusif.",
  icons: {
    icon: "/icon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}