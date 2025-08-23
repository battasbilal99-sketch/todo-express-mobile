import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const dbName = 'todo_express';

class Database {
  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;
    this.db = await this.sqlite.createConnection(dbName, false, 'no-encryption', 1, false);
    await this.db.open();
    await this.createTables();
    await this.seed();
    return this.db;
  }

  async createTables() {
    const statements = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'normal',
        created_date TEXT DEFAULT (datetime('now')),
        completed_at TEXT
      );
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        last_completion_date TEXT,
        badges TEXT DEFAULT '[]',
        completed_tasks_count INTEGER DEFAULT 0,
        completed_high_priority_count INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        notifications_enabled INTEGER DEFAULT 1,
        animations_enabled INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'system'
      );
    `;
    await this.db.execute(statements);
  }

  async seed() {
    const u = await this.db.query('SELECT COUNT(*) as c FROM user_profile;');
    if ((u.values?.[0]?.c ?? 0) === 0) {
      await this.db.run(
        'INSERT INTO user_profile (id, level, xp, streak_days, badges) VALUES (1, 1, 0, 0, ?);',
        ['[]']
      );
    }

    const s = await this.db.query('SELECT COUNT(*) as c FROM settings;');
    if ((s.values?.[0]?.c ?? 0) === 0) {
      await this.db.run(
        'INSERT INTO settings (id, notifications_enabled, animations_enabled, theme) VALUES (1, 1, 1, ?);',
        ['system']
      );
    }

    const t = await this.db.query('SELECT COUNT(*) as c FROM tasks;');
    if ((t.values?.[0]?.c ?? 0) === 0) {
      const sets = [
        { title: 'Découvrir l’app', description: 'Compléter une tâche', priority: 'normal' },
        { title: 'Créer 1ère tâche', description: 'Cliquer sur +', priority: 'low' },
        { title: 'Passer une tâche en done', description: 'Coche la case', priority: 'high' },
      ].map(x => ({
        statement: 'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?);',
        values: [x.title, x.description, x.priority]
      }));
      await this.db.executeSet({ set: sets.map(capSQLiteSet) });
    }
  }

  async all(sql, params = []) { const r = await this.db.query(sql, params); return r.values || []; }
  async one(sql, params = []) { const r = await this.db.query(sql, params); return (r.values||[])[0]||null; }
  async run(sql, params = []) { return this.db.run(sql, params); }
}

export default new Database();
