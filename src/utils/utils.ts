
/**
 * Utility functions for Discord Game Show
 */

/**
 * Generate a random neon color
 * @returns RGB color string
 */
export function getRandomNeonColor(): string {
  const neonColors = [
    "#ff00ff", // Neon pink
    "#00ffff", // Neon cyan
    "#ff0099", // Neon magenta
    "#00ff99", // Neon green
    "#ff3300", // Neon orange
    "#ffff00", // Neon yellow
    "#9900ff", // Neon purple
    "#00ff00", // Neon lime
    "#ff66ff", // Light neon pink
    "#66ffff", // Light neon cyan
  ];

  return neonColors[Math.floor(Math.random() * neonColors.length)];
}

/**
 * Generate a unique token
 * @returns Random token string
 */
export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Generate a unique token (alias of generateToken for backward compatibility)
 * @returns Random token string
 */
export function generateUniqueToken(): string {
  return generateToken();
}

/**
 * Format time in seconds to mm:ss format
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Truncate text if it's too long
 * @param text Text to truncate
 * @param maxLength Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param array Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Calculate points based on difficulty and time remaining
 * @param difficulty Question difficulty level
 * @param timeRemaining Time remaining in seconds
 * @returns Points to award
 */
export function calculatePoints(difficulty: number, timeRemaining?: number): number {
  // Base points by difficulty
  const basePoints = difficulty * 100;
  
  // Bonus for answering quickly
  if (timeRemaining !== undefined) {
    const timeBonus = Math.floor((timeRemaining / 30) * 50);
    return basePoints + timeBonus;
  }
  
  return basePoints;
}
