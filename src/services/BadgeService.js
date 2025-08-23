import db from './database.js';

const CATALOG = [
  { id: 'first-completion', name: 'Première !', description: 'Première tâche complétée', icon: '🏅' },
  { id: 'ten-tasks', name: 'x10', description: '10 tâches complétées', icon: '⭐' },
  { id: 'priority-master', name: 'Priorités', description: '5 tâches Élevées', icon: '🚩' },
  { id: 'streak-3', name: 'Streak 3', description: '3 jours d’affilée', icon: '🔥' },
  { id: 'streak-7', name: 'Streak 7', description: '7 jours d’affilée', icon: '🔥🔥' },
  { id: 'daily-cleaner', name: 'Day 100%', description: 'Toutes les tâches du jour', icon: '🏆' },
  { id: 'level-5', name: 'Lvl 5', description: 'Atteindre le niveau 5', icon: '🚀' },
  { id: 'level-10', name: 'Lvl 10', description: 'Atteindre le niveau 10', icon: '🚀🚀' },
];

export const BadgeService = {
  catalog() { return CATALOG; },
  async listUnlocked() {
    const row = await db.one('SELECT badges FROM user_profile WHERE id=1;');
    try { return JSON.parse(row?.badges || '[]'); } catch { return []; }
  },
  async unlock(id) {
    const arr = await this.listUnlocked();
    if (arr.includes(id)) return arr;
    arr.push(id);
    await db.run('UPDATE user_profile SET badges=? WHERE id=1;', [JSON.stringify(arr)]);
    return arr;
  }
};
