
// Prosty generator losowych imion dla graczy
const prefixes = [
  "Gracz", "Player", "Gamer", "Pro", "Super", "Ultra", "Mega", "Epic",
  "Legend", "Master", "King", "Queen", "Lord", "Champion", "Hero"
];

const suffixes = [
  "123", "XYZ", "Prime", "Boss", "Star", "Guru", "Ninja", "Wizard",
  "Phoenix", "Dragon", "Tiger", "Eagle", "Wolf", "Lion", "Bear"
];

/**
 * Generuje losowe imię gracza
 * @returns Losowo wygenerowane imię gracza
 */
export function getRandomName(): string {
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomNumber = Math.floor(Math.random() * 100);
  
  return `${randomPrefix}${randomSuffix}${randomNumber}`;
}
