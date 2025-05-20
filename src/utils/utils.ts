
/**
 * Returns a random neon color in hexadecimal format
 */
export function getRandomNeonColor(): string {
  const neonColors = [
    '#FF00FF', // Neon Pink
    '#00FFFF', // Neon Cyan
    '#FF6600', // Neon Orange
    '#FFFF00', // Neon Yellow
    '#00FF00', // Neon Green
    '#FF0000', // Neon Red
    '#9D00FF', // Neon Purple
    '#0088FF', // Neon Blue
  ];
  
  return neonColors[Math.floor(Math.random() * neonColors.length)];
}

/**
 * Format date to a readable string (e.g. "12 May 2023")
 */
export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format time (24-hour format)
 */
export function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

/**
 * Generate player link
 */
export async function generatePlayerLink(playerId: string): Promise<{ success: boolean, data?: { link: string } }> {
  try {
    return {
      success: true,
      data: {
        link: `${window.location.origin}/player/${playerId}`
      }
    };
  } catch (error) {
    console.error('Error generating player link:', error);
    return { success: false };
  }
}

/**
 * Generate a unique ID
 */
export function generateUniqueId(): string {
  return crypto.randomUUID();
}
