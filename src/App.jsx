import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Tasks from './pages/Tasks'
import Badges from './pages/Badges'
import Settings from './pages/Settings'
import './index.css'

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px' }}>
      {/* Navigation simple */}
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/tasks">📝 Tâches</Link>
        <Link to="/badges">🏅 Badges</Link>
        <Link to="/settings">⚙️ Paramètres</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
