
export const pathToTab: Record<string, string> = {
  '/settings': 'gracze',
  '/settings/': 'gracze', 
  '/settings/gracze': 'gracze',
  '/settings/pytania': 'pytania',
  '/settings/karty': 'karty',
  '/settings/rundy': 'rundy',
  '/settings/motywy': 'motywy',
  '/settings/dzwieki': 'dzwieki',
  '/settings/role': 'role',
  '/settings/ranking': 'ranking',
  '/settings/kolo': 'kolo',
  '/settings/automatyzacja': 'automatyzacja',
  '/settings/haslo': 'haslo',
  '/settings/testy': 'testy',
  '/settings/kalendarz': 'kalendarz' // Nowa ścieżka dla kalendarza
};

export const tabToPath: Record<string, string> = {
  'gracze': '/settings/gracze',
  'pytania': '/settings/pytania',
  'karty': '/settings/karty',
  'rundy': '/settings/rundy',
  'motywy': '/settings/motywy',
  'dzwieki': '/settings/dzwieki',
  'role': '/settings/role',
  'ranking': '/settings/ranking',
  'kolo': '/settings/kolo',
  'automatyzacja': '/settings/automatyzacja',
  'haslo': '/settings/haslo',
  'testy': '/settings/testy',
  'kalendarz': '/settings/kalendarz' // Nowa ścieżka dla kalendarza
};
