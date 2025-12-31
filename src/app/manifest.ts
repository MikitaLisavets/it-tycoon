import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'IT Tycoon',
        short_name: 'IT Tycoon',
        description: 'A retro Windows XP style IT Tycoon game',
        start_url: '/',
        display: 'standalone',
        background_color: '#536F96',
        theme_color: '#0054E3',
        icons: [
            {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
