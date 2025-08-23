import db from './database.js';
import { BadgeService } from './BadgeService.js';

function need(level){ return 50 + Math.max(0, level-1)*25; }

export const UserService = {
  async me() {
    await db.init();
    const row = await db.one('SELECT * FROM user_profile WHERE id=1;');
    return { ...row, nextLevelXp: need(row.level) };
  },

  async update(data) {
    await db.init();
    const fields = [], params = [];
    for (const [k,v] of Object.entries(data)) {
      if (['level','xp','streak_days','last_completion_date','badges','completed_tasks_count','completed_high_priority_count'].includes(k)) {
        fields.push(`${k}=?`); params.push(typeof v==='object'?JSON.stringify(v):v);
      }
    }
    if (!fields.length) return this.me();
    params.push(1);
    await db.run(`UPDATE user_profile SET ${fields.join(', ')} WHERE id=?;`, params);
    return this.me();
  },

  async addXp(amount) {
    const u = await this.me();
    let xp = u.xp + amount, level = u.level;
    while (xp >= need(level)) { xp -= need(level); level += 1; if (level===5) await BadgeService.unlock('level-5'); if (level===10) await BadgeService.unlock('level-10'); }
    return this.update({ xp, level });
  },

  async applyCompletionRewards(task) {
    let base = 10, mult = task.priority==='high'?1.5:task.priority==='normal'?1.25:1.0, bonus = 0;
    const u = await this.me();
    const today = new Date().toISOString().slice(0,10);
    const last = (u.last_completion_date||'').slice(0,10);
    const y = (()=>{const d=new Date(); d.setDate(d.getDate()-1); return d.toISOString().slice(0,10)})();

    let streak = u.streak_days;
    if (last === y) streak += 1; else if (last !== today) streak = 1;
    if (streak >= 3) bonus += 5;
    if (last !== today) bonus += 3;

    const gained = Math.round(base*mult + bonus);
    const completed_tasks_count = (u.completed_tasks_count||0) + 1;
    const completed_high_priority_count = (u.completed_high_priority_count||0) + (task.priority==='high'?1:0);

    if (completed_tasks_count === 1) await BadgeService.unlock('first-completion');
    if (completed_tasks_count >= 10) await BadgeService.unlock('ten-tasks');
    if (completed_high_priority_count >= 5) await BadgeService.unlock('priority-master');
    if (streak >= 3) await BadgeService.unlock('streak-3');
    if (streak >= 7) await BadgeService.unlock('streak-7');

    await this.update({ last_completion_date: today, streak_days: streak, completed_tasks_count, completed_high_priority_count });
    await this.addXp(gained);
    return { gainedXp: gained, newStreak: streak };
  }
};
