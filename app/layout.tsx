import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white min-h-screen">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
