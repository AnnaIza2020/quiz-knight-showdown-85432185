
// Mapping between tab IDs and their paths in the Settings
export const pathToTab: Record<string, string> = {
  '/settings': 'gracze',
  '/settings/gracze': 'gracze',
  '/settings/pytania': 'pytania',
  '/settings/karty': 'karty',
  '/settings/motywy': 'motywy',
  '/settings/dzwieki': 'dzwieki',
  '/settings/role': 'role',
  '/settings/ranking': 'ranking',
  '/settings/automatyzacja': 'automatyzacja',
  '/settings/haslo': 'haslo',
  '/settings/testy': 'testy',
  '/settings/kolo': 'kolo'
};

// Array of tab definitions
export const tabDefinitions = [
  { id: 'gracze', label: 'Gracze', path: '/settings/gracze' },
  { id: 'pytania', label: 'Pytania', path: '/settings/pytania' },
  { id: 'karty', label: 'Karty', path: '/settings/karty' },
  { id: 'motywy', label: 'Motywy', path: '/settings/motywy' },
  { id: 'dzwieki', label: 'Dźwięki', path: '/settings/dzwieki' },
  { id: 'role', label: 'Role', path: '/settings/role' },
  { id: 'ranking', label: 'Ranking', path: '/settings/ranking' },
  { id: 'kolo', label: 'Koło fortuny', path: '/settings/kolo' },
  { id: 'automatyzacja', label: 'Automatyzacja', path: '/settings/automatyzacja' },
  { id: 'haslo', label: 'Hasło', path: '/settings/haslo' },
  { id: 'testy', label: 'Testy', path: '/settings/testy' },
];

export default tabDefinitions;
