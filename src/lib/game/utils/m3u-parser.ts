
/**
 * Fetches and parses an M3U playlist file to extract the first valid stream URL.
 * @param url The URL of the M3U playlist.
 * @returns A promise that resolves to the first stream URL found, or null if parsing fails.
 */
export async function parseM3U(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch M3U playlist: ${response.statusText}`);
            return null;
        }

        const text = await response.text();
        const lines = text.split(/\r?\n/);

        // Find the first non-empty line that doesn't start with #
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                return trimmed;
            }
        }

        console.warn('No valid stream URL found in M3U playlist.');
        return null;
    } catch (error) {
        console.error('Error parsing M3U playlist:', error);
        return null;
    }
}
