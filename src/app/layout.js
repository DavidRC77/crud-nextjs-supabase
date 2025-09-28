// src/app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header"; // 👈 Importa el Header

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Diseño Web II - CRUD Next.js",
  description: "Proyecto de gestión de usuarios con Shadcn/ui y Supabase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <main className="min-h-[90vh]">
          {children}
        </main>
      </body>
    </html>
  );
}