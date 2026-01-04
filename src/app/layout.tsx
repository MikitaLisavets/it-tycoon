import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Corrected import based on usage in previous file
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import CheatSystem from "@/components/CheatSystem/CheatSystem";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "IT Tycoon",
    description: "Retro IT Tycoon Game",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <AppProviders>
                    {children}
                    <CheatSystem />
                </AppProviders>
            </body>
        </html>
    );
}
