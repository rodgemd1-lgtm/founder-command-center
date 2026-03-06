import { Component, type ReactNode } from 'react'
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppShell } from '@/components/layout/AppShell'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { Dashboard } from '@/pages/Dashboard'
import { BusinessDetail } from '@/pages/BusinessDetail'
import { Intelligence } from '@/pages/Intelligence'
import { Experts } from '@/pages/Experts'
import { DecisionLog } from '@/pages/DecisionLog'
import { ResearchFeed } from '@/pages/ResearchFeed'
import { Vault } from '@/pages/Vault'
import { Notes } from '@/pages/Notes'
import { Auth } from '@/pages/Auth'
import { Waitlist } from '@/pages/Waitlist'
import { Loader2 } from 'lucide-react'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
          <p className="text-lg font-medium text-gray-900">Something went wrong</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
      <p className="text-lg font-medium text-gray-900">Page not found</p>
      <Link to="/" className="text-sm text-amber-600 hover:text-amber-700 underline">
        Back to home
      </Link>
    </div>
  )
}

function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

function AuthRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Auth />
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#111827',
            border: '1px solid #E5E7EB',
          },
        }}
      />
      <ErrorBoundary>
        <Routes>
          <Route path="/auth" element={<AuthRoute />} />
          <Route path="/waitlist/:product" element={<Waitlist />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="/business/:slug" element={<BusinessDetail />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route path="/experts" element={<Experts />} />
              <Route path="/decisions" element={<DecisionLog />} />
              <Route path="/research" element={<ResearchFeed />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/notes" element={<Notes />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </AuthProvider>
  )
}
