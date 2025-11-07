// File: app/layout.tsx
import "../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "App",
  description: "Descrição",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="pt-PT" className="dark">
      <body>{children}</body>
      </html>
  );
}