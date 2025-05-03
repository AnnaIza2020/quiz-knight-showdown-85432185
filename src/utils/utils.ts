/**
 * Generates a unique token for identifying players
 */
export function generateUniqueToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Generates a unique identifier
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Alias dla generateUniqueId dla zapewnienia kompatybilności wstecznej
 */
export function generateUniqueToken(): string {
  return generateUniqueId();
}

/**
 * Zwraca losowy kolor neonowy (dla graczy, kart, itd.)
 */
export function getRandomNeonColor(): string {
  const neonColors = [
    '#ff00ff', // Neonowy różowy
    '#00ffff', // Neonowy cyjan
    '#00ff00', // Neonowy zielony
    '#ffff00', // Neonowy żółty
    '#ff9900', // Neonowy pomarańczowy
    '#ff00cc', // Neonowy magenta
    '#00ccff', // Neonowy jasnoniebieski
    '#cc00ff', // Neonowy fioletowy
    '#ff3366', // Neonowy czerwonoróżowy
    '#33ccff', // Neonowy błękitny
  ];
  
  return neonColors[Math.floor(Math.random() * neonColors.length)];
}

// Funkcja do głębokiego porównania obiektów
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}
