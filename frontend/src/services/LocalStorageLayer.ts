/**
 * Sloj za pohranu JSON podataka u localStorage.
 * Koristi se za privremeno spremanje izmijenjenih podataka iz grafa.
 */
export const LocalStorageLayer = {
  saveJSON: (key: string, data: object) => {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(key, json);
    } catch (error) {
    }
  },

  loadJSON: (key: string): any | null => {
    try {
      const json = localStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      return null;
    }
  },

  deleteJSON: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting JSON from localStorage:', error);
    }
  },

  listAllKeys: (): string[] => {
    return Object.keys(localStorage);
  }
};
