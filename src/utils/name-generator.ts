
/**
 * Utility to generate random player names for testing
 */

const firstNames = [
  "Krzysiek", "Tomek", "Ania", "Mateusz", "Wojtek", 
  "Kasia", "Piotr", "Magda", "Michał", "Zosia",
  "Bartek", "Julka", "Adam", "Ola", "Jakub",
  "Kamil", "Agata", "Marcin", "Natalia", "Filip"
];

const lastNames = [
  "Streamer", "Gamer", "Pro", "Fan", "Creator",
  "Player", "Master", "Legend", "Champion", "Warrior",
  "Phoenix", "Dragon", "Knight", "Wizard", "Hunter",
  "Star", "Hero", "Shark", "Tiger", "Eagle"
];

/**
 * Generate a random name for a player
 * @returns Random name string
 */
export function getRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName}${lastName}`;
}

/**
 * Generate multiple random names
 * @param count Number of names to generate
 * @returns Array of random names
 */
export function getRandomNames(count: number): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    names.push(getRandomName());
  }
  return names;
}
