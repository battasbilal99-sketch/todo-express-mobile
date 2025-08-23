import db from './database.js';

export const SettingsService = {
  async get() {
    await db.init();
    return db.one('SELECT * FROM settings WHERE id = 1;');
  },

  async update(data) {
    await db.init();
    const fields = [], params = [];
    for (const [k,v] of Object.entries(data)) {
      if (['notifications_enabled','animations_enabled','theme'].includes(k)) {
        fields.push(`${k} = ?`);
        params.push(v);
      }
    }
    if (!fields.length) return this.get();
    params.push(1);
    await db.run(`UPDATE settings SET ${fields.join(', ')} WHERE id = ?;`, params);
    return this.get();
  }
};
