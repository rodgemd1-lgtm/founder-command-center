import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Brain,
  Users,
  UsersRound,
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

const businessIcons: Record<string, typeof Dumbbell> = {
  FITNESS: Dumbbell,
  INSTAGRAM: Sparkles,
  INTELLIGENCE: Cpu,
  AUTOMOTIVE: Wrench,
}

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
      icon: businessIcons[b.tag] || Cpu,
      label: b.name,
      status: b.status,
    })),
  },
  {
    label: 'Tools',
    items: [
      { to: '/intelligence', icon: Brain, label: 'Intelligence' },
      { to: '/council', icon: Users, label: 'Elite Council' },
      { to: '/agents', icon: UsersRound, label: 'Agent Roster' },
      { to: '/vault', icon: KeyRound, label: 'Vault' },
      { to: '/notes', icon: StickyNote, label: 'Notes' },
    ],
  },
]

function StatusDot({ status }: { status?: string }) {
  const color = status === 'active' ? 'bg-success' : status === 'pre-launch' ? 'bg-overlay' : 'bg-warning'
  return <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse-dot', color)} />
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Sidebar — Jony Ive: restrained, hierarchical, generous spacing */}
      <aside className="w-60 shrink-0 bg-base border-r border-separator-subtle flex flex-col overflow-y-auto">
        <div className="px-5 pt-6 pb-5">
          <h1 className="text-[15px] font-semibold text-label tracking-tight">
            Founder<span className="text-accent">OS</span>
          </h1>
          <p className="text-[11px] text-label-tertiary mt-0.5 tracking-wide">Command Center</p>
        </div>

        <nav className="flex-1 px-3 pb-4 space-y-7">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary">
                {section.label}
              </p>
              <ul className="space-y-px">
                {section.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-base group',
                          isActive
                            ? 'bg-accent-muted text-accent'
                            : 'text-label-secondary hover:text-label hover:bg-surface/50'
                        )
                      }
                    >
                      <item.icon className="w-[16px] h-[16px] shrink-0 opacity-80" />
                      <span className="truncate flex-1">{item.label}</span>
                      {'status' in item && <StatusDot status={item.status} />}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-separator-subtle">
          <p className="text-[11px] text-label-quaternary">Mike Rodgers</p>
          <p className="text-[10px] text-label-quaternary/60">Apex Ventures</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Breadcrumb bar — frosted glass */}
        <header className="sticky top-0 z-10 glass px-6 py-3 flex items-center gap-2 text-[12px] text-label-tertiary">
          <NavLink to="/" className="hover:text-label-secondary transition-fast">Home</NavLink>
          {location.pathname !== '/' && (
            <>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="text-label-secondary capitalize">
                {decodeURIComponent(location.pathname.split('/').filter(Boolean).join(' / '))}
              </span>
            </>
          )}
        </header>

        <div className="px-8 py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
