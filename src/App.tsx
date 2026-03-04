import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { BusinessDetail } from './pages/BusinessDetail'
import { Intelligence } from './pages/Intelligence'
import { Council } from './pages/Council'
import { Vault } from './pages/Vault'
import { Notes } from './pages/Notes'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/business/:slug" element={<BusinessDetail />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/council" element={<Council />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </AppShell>
    </>
  )
}
