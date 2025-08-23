import { useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import { UserService } from '../services/UserService';
import { BadgeService } from '../services/BadgeService';

export default function Tasks(){
  const [tasks,setTasks] = useState([]);
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [priority,setPriority] = useState('normal');
  const [user,setUser] = useState(null);

  const load = async () => {
    const [rows, me] = await Promise.all([
      TaskService.list('-created_date'),
      UserService.me()
    ]);
    setTasks(rows); setUser(me);
  };

  useEffect(()=>{ load(); },[]);

  const add = async e => {
    e.preventDefault();
    if (!title.trim()) return;
    await TaskService.create({ title, description: desc, priority });
    setTitle(''); setDesc(''); setPriority('normal');
    load();
  };

  const toggle = async (t) => {
    const updated = await TaskService.setCompleted(t.id, !t.completed);
    if (updated.completed) {
      await UserService.applyCompletionRewards(updated);
      const { todayTotal, todayDone } = await TaskService.statsToday();
      if (todayTotal > 0 && todayDone === todayTotal) await BadgeService.unlock('daily-cleaner');
    }
    load();
  };

  const del = async (id) => { await TaskService.delete(id); load(); };

  return (
    <div>
      <header style={{background:'#ffffffaa', padding:12, borderRadius:12, marginBottom:16}}>
        <div style={{fontWeight:700}}>Niveau {user?.level ?? '-'}</div>
        <div style={{fontSize:12}}>{user?.xp ?? 0} XP / {user?.nextLevelXp ?? 0}</div>
        <div style={{height:8, background:'#eee', borderRadius:999, marginTop:6}}>
          <div style={{
            height:8,
            width:`${Math.min(100, ((user?.xp||0)/(user?.nextLevelXp||1))*100)}%`,
            background:'#7C3AED',
            borderRadius:999
          }} />
        </div>
      </header>

      <form onSubmit={add} style={{display:'grid', gap:8, background:'#fff', padding:12, borderRadius:12, marginBottom:16}}>
        <input placeholder="Titre" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option value="low">Faible</option>
          <option value="normal">Normale</option>
          <option value="high">Élevée</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>

      {tasks.length === 0 ? <p>Aucune tâche.</p> : (
        <ul style={{display:'grid', gap:8}}>
          {tasks.map(t=>(
            <li key={t.id} style={{
              background:'#fff',
              padding:12,
              borderRadius:12,
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between'
            }}>
              <div>
                <div style={{textDecoration: t.completed?'line-through':'none', fontWeight:600}}>{t.title}</div>
                <div style={{fontSize:12, opacity:.7}}>{t.description}</div>
                <div style={{fontSize:12, marginTop:4}}>Priorité : {t.priority}</div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <button onClick={()=>toggle(t)}>{t.completed?'↩️':'✅'}</button>
                <button onClick={()=>del(t.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
