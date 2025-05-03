
/**
 * Generuje unikalny token dla gracza
 * @returns Unikalny token w formie losowego ciągu znaków
 */
export function generateUniqueToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Generuje losowy kolor w stylu neonowym
 * @returns Kolor neonowy w formacie HEX (#RRGGBB)
 */
export function getRandomNeonColor(): string {
  const neonColors = [
    '#ff00ff', // neon pink
    '#00ffff', // neon cyan
    '#00ff00', // neon green
    '#ff00aa', // neon magenta
    '#aa00ff', // neon purple
    '#ff3300', // neon orange
    '#ffff00', // neon yellow
    '#00ccff'  // neon blue
  ];
  
  return neonColors[Math.floor(Math.random() * neonColors.length)];
}

/**
 * Formatuje czas w sekundach na format MM:SS
 * @param seconds Czas w sekundach
 * @returns Sformatowany czas w formacie MM:SS
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Generuje unikalny identyfikator UUID
 * @returns Unikalny identyfikator UUID
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
