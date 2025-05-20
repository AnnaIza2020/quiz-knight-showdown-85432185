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

/**
 * Deep equality check for objects
 */
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;

    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

/**
 * Debounce function to limit the rate at which a function can fire
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};
