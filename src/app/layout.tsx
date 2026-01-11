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
    title: "Desktop Life | IT Tycoon & Life Simulator",
    description: "Experience the journey from a warehouse worker to an IT Investor. Manage your stats, upgrade your hardware, and master the IT world in this retro-styled tycoon simulator.",
    keywords: ["IT Tycoon", "Life Simulator", "Retro Game", "Programming Game", "Hacking Simulator", "Career Management", "Desktop Simulator", "Tycoon Game"],
    authors: [{ name: "MikiApps" }],
    creator: "MikiApps",
    publisher: "MikiApps",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "Desktop Life | IT Tycoon & Life Simulator",
        description: "Experience the journey from a warehouse worker to an IT Investor. Manage your stats, upgrade your hardware, and master the IT world.",
        url: "https://desktop.mikiapps.com",
        siteName: "Desktop Life",
        images: [
            {
                url: "/images/og-preview.png",
                width: 1200,
                height: 630,
                alt: "Desktop Life | IT Tycoon & Life Simulator",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Desktop Life | IT Tycoon & Life Simulator",
        description: "Experience the journey from a warehouse worker to an IT Investor. Manage your stats and upgrade your hardware.",
        images: ["/images/og-preview.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
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
