"use client";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-PT">
        <body>
        <ThemeProvider attribute="class" defaultTheme="light">
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
