import { useEffect, useState } from 'react';
import { BadgeService } from '../services/BadgeService';

export default function Badges(){
  const [catalog,setCatalog] = useState([]);
  const [unlocked,setUnlocked] = useState([]);

  useEffect(()=>{
    setCatalog(BadgeService.catalog());
    BadgeService.listUnlocked().then(setUnlocked);
  },[]);

  return (
    <div>
      <h2 style={{color:'#fff', marginBottom:12}}>Mes badges</h2>
      <div style={{display:'grid', gap:8}}>
        {catalog.map(b=>{
          const has = unlocked.includes(b.id);
          return (
            <div key={b.id} style={{
              background:'#fff',
              padding:12,
              borderRadius:12,
              opacity: has?1:0.5
            }}>
              <div style={{fontWeight:700}}>{b.icon} {b.name}</div>
              <div style={{fontSize:12}}>{b.description}</div>
              {!has && <div style={{fontSize:12, marginTop:4}}>À débloquer</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
