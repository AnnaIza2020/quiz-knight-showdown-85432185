
// Map URL paths to tab values
export const pathToTab: Record<string, string> = {
  '/settings': 'gracze',
  '/settings/players': 'gracze',
  '/settings/questions': 'pytania',
  '/settings/cards': 'karty',
  '/settings/rounds': 'rundy',
  '/settings/themes': 'motywy',
  '/settings/sounds': 'dzwieki',
  '/settings/roles': 'role',
  '/settings/ranking': 'ranking',
  '/settings/wheel': 'kolo',
  '/settings/automation': 'automatyzacja',
  '/settings/password': 'haslo',
  '/settings/tests': 'testy',
  '/settings/calendar': 'kalendarz',
};

// Map tab values to URL paths
export const tabToPath: Record<string, string> = {
  'gracze': '/settings/players',
  'pytania': '/settings/questions',
  'karty': '/settings/cards',
  'rundy': '/settings/rounds',
  'motywy': '/settings/themes',
  'dzwieki': '/settings/sounds',
  'role': '/settings/roles',
  'ranking': '/settings/ranking',
  'kolo': '/settings/wheel',
  'automatyzacja': '/settings/automation',
  'haslo': '/settings/password',
  'testy': '/settings/tests',
  'kalendarz': '/settings/calendar',
};
