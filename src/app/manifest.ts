import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Desktop Life | IT Tycoon & Life Simulator',
        short_name: 'Desktop Life',
        description: 'Experience the journey from a warehouse worker to an IT Investor. Manage your stats, upgrade your hardware, and master the IT world.',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1a2e',
        theme_color: '#0054E3',
        icons: [
            {
                src: '/favicon.jpg',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/icons/icon-192.jpg',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512.jpg',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
