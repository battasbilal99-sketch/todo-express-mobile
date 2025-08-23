import db from './database.js';

export const TaskService = {
  async list(orderBy = '-created_date') {
    await db.init();
    const desc = orderBy.startsWith('-');
    const field = orderBy.replace('-', '') || 'created_date';
    return db.all(`SELECT * FROM tasks ORDER BY ${field} ${desc ? 'DESC' : 'ASC'};`);
  },

  async create({ title, description = '', priority = 'normal' }) {
    await db.init();
    if (!title?.trim()) throw new Error('Title required');
    await db.run('INSERT INTO tasks (title, description, priority) VALUES (?,?,?);', [title.trim(), description, priority]);
    const rows = await this.list('-created_date');
    return rows[0];
  },

  async update(id, data) {
    await db.init();
    const fields = [], params = [];
    for (const [k,v] of Object.entries(data)) {
      if (['title','description','priority','completed','completed_at'].includes(k)) { fields.push(`${k}=?`); params.push(v); }
    }
    if (!fields.length) return this.get(id);
    params.push(id);
    await db.run(`UPDATE tasks SET ${fields.join(', ')} WHERE id=?;`, params);
    return this.get(id);
  },

  async setCompleted(id, completed) {
    await db.init();
    const completed_at = completed ? new Date().toISOString() : null;
    await db.run('UPDATE tasks SET completed=?, completed_at=? WHERE id=?;', [completed?1:0, completed_at, id]);
    return this.get(id);
  },

  async delete(id) { await db.init(); await db.run('DELETE FROM tasks WHERE id=?;', [id]); },
  async get(id) { await db.init(); return db.one('SELECT * FROM tasks WHERE id=?;', [id]); },

  async statsToday() {
    await db.init();
    const today = new Date().toISOString().slice(0,10);
    const total = await db.one(`SELECT COUNT(*) c FROM tasks WHERE date(created_date)=date(?);`, [today]);
    const done  = await db.one(`SELECT COUNT(*) c FROM tasks WHERE completed=1 AND date(completed_at)=date(?);`, [today]);
    return { todayTotal: total?.c||0, todayDone: done?.c||0 };
  }
};
