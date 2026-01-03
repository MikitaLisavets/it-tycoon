/**
 * Format a number with appropriate suffix for large values
 * Examples:
 * - 123.45 -> "123.45"
 * - 1,234.56 -> "1.23k"
 * - 1,234,567.89 -> "1.23M"
 * - 1,234,567,890.12 -> "1.23B"
 * 
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with suffix
 */
export function formatNumberWithSuffix(value: number, decimals: number = 2): string {
    const absValue = Math.abs(value);

    if (absValue >= 1e12) {
        return (value / 1e12).toFixed(decimals) + 'T';
    } else if (absValue >= 1e9) {
        return (value / 1e9).toFixed(decimals) + 'B';
    } else if (absValue >= 1e6) {
        return (value / 1e6).toFixed(decimals) + 'M';
    } else if (absValue >= 1e3) {
        return (value / 1e3).toFixed(decimals) + 'k';
    } else {
        return value.toFixed(decimals);
    }
}
