import { useEffect, useState } from 'react';
import { SettingsService } from '../services/SettingsService';

export default function Settings(){
  const [s,setS] = useState({ notifications_enabled:1, animations_enabled:1, theme:'system' });

  useEffect(()=>{ SettingsService.get().then(r=>r && setS(r)); },[]);
  const save = async (patch) => { const next = await SettingsService.update(patch); setS(next); };

  return (
    <div style={{display:'grid', gap:12}}>
      <h2 style={{color:'#fff'}}>Paramètres</h2>
      <label style={{background:'#fff', padding:12, borderRadius:12, display:'flex', justifyContent:'space-between'}}>
        Notifications
        <input type="checkbox" checked={!!s.notifications_enabled} onChange={e=>save({notifications_enabled: e.target.checked?1:0})} />
      </label>
      <label style={{background:'#fff', padding:12, borderRadius:12, display:'flex', justifyContent:'space-between'}}>
        Animations
        <input type="checkbox" checked={!!s.animations_enabled} onChange={e=>save({animations_enabled: e.target.checked?1:0})} />
      </label>
      <label style={{background:'#fff', padding:12, borderRadius:12, display:'flex', justifyContent:'space-between'}}>
        Thème
        <select value={s.theme} onChange={e=>save({theme:e.target.value})}>
          <option value="system">Système</option>
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
      </label>
    </div>
  );
}
