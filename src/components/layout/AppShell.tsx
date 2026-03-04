import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Brain,
  Users,
  KeyRound,
  StickyNote,
  Dumbbell,
  Sparkles,
  Cpu,
  Wrench,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { businesses } from '@/lib/data'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Businesses',
    items: businesses.map(b => ({
      to: `/business/${b.slug}`,
      icon: b.tag === 'FITNESS' ? Dumbbell : b.tag === 'INSTAGRAM' ? Sparkles : b.tag === 'INTELLIGENCE' ? Cpu : Wrench,
      label: b.name,
      status: b.status,
    })),
  },
  {
    label: 'Tools',
    items: [
      { to: '/intelligence', icon: Brain, label: 'Intelligence Library' },
      { to: '/council', icon: Users, label: 'Elite Council' },
      { to: '/vault', icon: KeyRound, label: 'Vault' },
      { to: '/notes', icon: StickyNote, label: 'Notes' },
    ],
  },
]

function StatusDot({ status }: { status?: string }) {
  const color = status === 'active' ? 'bg-emerald-400' : status === 'pre-launch' ? 'bg-slate-500' : 'bg-amber-400'
  return <span className={cn('w-2 h-2 rounded-full animate-pulse-dot', color)} />
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-surface-1 border-r border-slate-800 flex flex-col overflow-y-auto">
        <div className="px-5 py-5 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white tracking-tight">
            Founder<span className="text-brand-500">OS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Command Center</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors group',
                          isActive
                            ? 'bg-brand-500/10 text-brand-400'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        )
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1">{item.label}</span>
                      {'status' in item && <StatusDot status={item.status} />}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800">
          <p className="text-[10px] text-slate-600 text-center">Mike Rodgers — Apex Ventures</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <header className="sticky top-0 z-10 glass px-6 py-3 flex items-center gap-2 text-xs text-slate-500">
          <NavLink to="/" className="hover:text-slate-300 transition-colors">Home</NavLink>
          {location.pathname !== '/' && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-300 capitalize">
                {location.pathname.split('/').filter(Boolean).join(' / ')}
              </span>
            </>
          )}
        </header>

        <div className="px-6 py-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
