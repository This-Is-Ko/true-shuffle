/**
 * Formats a number with spaces as thousand separators for numbers >= 1000
 * Example: 1000 -> "1 000", 1000000 -> "1 000 000"
 * 
 * @param {number|string} number - The number to format
 * @returns {string|number} - Formatted number string if >= 1000, original value otherwise
 */
export function formatNumberWithSpaces(number) {
    // Handle null, undefined, or non-numeric values
    if (number == null || number === '') {
        return number;
    }
    
    // Convert to number if it's a string
    const num = typeof number === 'string' ? parseFloat(number) : number;
    
    // Check if it's a valid number
    if (isNaN(num)) {
        return number; // Return original if not a valid number
    }
    
    // Only format if number is >= 1000
    if (num >= 1000) {
        // Convert to string and add spaces every 3 digits from right
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    
    // Return original number for values < 1000
    return num;
}

