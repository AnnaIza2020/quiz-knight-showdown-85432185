
// This file maps URL paths to tab values

export const pathToTab: Record<string, string> = {
  '/settings': 'gracze',          // Default tab
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
  '/settings/diagnostyka': 'diagnostyka',
  '/settings/backupy': 'backupy',
  '/settings/haslo': 'haslo',
  '/settings/testy': 'testy',
  '/settings/kalendarz': 'kalendarz'
};

// Reverse mapping for navigating from tab values to paths
export const tabToPath: Record<string, string> = Object.entries(pathToTab).reduce(
  (acc, [path, tab]) => {
    if (!acc[tab]) {
      acc[tab] = path;
    }
    return acc;
  },
  {} as Record<string, string>
);
