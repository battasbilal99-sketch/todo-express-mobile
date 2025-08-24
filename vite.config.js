import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GH Pages => sous-chemin /todo-express-mobile/
// Android/localhost => racine "/"
const isGhPages = process.env.VITE_GH_PAGES === 'true'

export default defineConfig({
  base: isGhPages ? '/todo-express-mobile/' : '/',
  plugins: [react()],
})
