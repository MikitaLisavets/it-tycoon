import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import CheatSystem from "@/components/CheatSystem/CheatSystem";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin", "cyrillic"],
    weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://desktop.mikiapps.com"),
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
    viewport: {
        width: "device-width",
        initialScale: 1,
        viewportFit: "cover",
    },
    icons: {
        icon: '/favicon.jpg',
        shortcut: '/favicon.jpg',
        apple: '/icons/icon-192.jpg',
        other: [
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/icons/icon-192.jpg',
            },
        ],
    },
    openGraph: {
        title: "Desktop Life | IT Tycoon & Life Simulator",
        description: "Experience the journey from a warehouse worker to an IT Investor. Manage your stats, upgrade your hardware, and master the IT world.",
        url: "https://desktop.mikiapps.com",
        siteName: "Desktop Life",
        images: [
            {
                url: "/images/og-preview.jpg",
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
        images: ["/images/og-preview.jpg"],
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
            <body className={roboto.variable}>
                <Script id="clarity-script" strategy="afterInteractive">
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "uzrnhmcxx7");
                    `}
                </Script>
                <AppProviders>
                    {children}
                    <CheatSystem />
                    <Analytics />
                </AppProviders>
            </body>
        </html>
    );
}
