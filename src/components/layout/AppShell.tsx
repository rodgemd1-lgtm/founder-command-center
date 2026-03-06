import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Dumbbell,
  Sparkles,
  Cpu,
  Wrench,
  BookOpen,
  Users,
  Scale,
  Newspaper,
  Lock,
  FileText,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

/* ------------------------------------------------------------------ */
/*  Stage badge colors                                                 */
/* ------------------------------------------------------------------ */
type Stage = 'IDEA' | 'MVP' | 'LAUNCH' | 'GROWTH' | 'SCALE'

const stageBadgeClass: Record<Stage, string> = {
  IDEA:   'bg-gray-100 text-gray-500',
  MVP:    'bg-blue-50 text-blue-600',
  LAUNCH: 'bg-orange-50 text-orange-600',
  GROWTH: 'bg-green-50 text-green-600',
  SCALE:  'bg-purple-50 text-purple-600',
}

function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={cn(
        'ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none shrink-0',
        stageBadgeClass[stage],
      )}
    >
      {stage}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Navigation data                                                    */
/* ------------------------------------------------------------------ */
interface NavItem {
  to: string
  icon: LucideIcon
  label: string
  stage?: Stage
  end?: boolean
}

interface NavSection {
  header: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    header: 'PORTFOLIO',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/experts?expert=jake-cofounder', icon: Zap, label: 'Jake (Co-Founder)' },
    ],
  },
  {
    header: 'BUSINESSES',
    items: [
      { to: '/business/transformfit', icon: Dumbbell, label: 'TransformFit', stage: 'MVP' },
      { to: '/business/viral-architect', icon: Sparkles, label: 'Viral Architect Hub', stage: 'MVP' },
      { to: '/business/intelligence-engine', icon: Cpu, label: 'Intelligence Engine', stage: 'MVP' },
      { to: '/business/automotive-os', icon: Wrench, label: 'Automotive Repair OS', stage: 'IDEA' },
    ],
  },
  {
    header: 'TOOLS',
    items: [
      { to: '/intelligence', icon: BookOpen, label: 'Intelligence' },
      { to: '/experts', icon: Users, label: 'Domain Experts' },
      { to: '/decisions', icon: Scale, label: 'Decisions' },
      { to: '/research', icon: Newspaper, label: 'Research Feed' },
      { to: '/vault', icon: Lock, label: 'Vault' },
      { to: '/notes', icon: FileText, label: 'Notes' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  AppShell layout                                                    */
/* ------------------------------------------------------------------ */
export function AppShell() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed z-50 top-0 left-0 h-full w-60 bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-transform duration-200',
          'md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">
              Founder<span className="text-amber-500">OS</span>
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">Command Center</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 pb-4 space-y-6">
          {sections.map((section) => (
            <div key={section.header}>
              <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                {section.header}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors group',
                          isActive
                            ? 'bg-amber-50 text-amber-700 border-l-2 border-amber-500 pl-[10px]'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        )
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1">{item.label}</span>
                      {item.stage && <StageBadge stage={item.stage} />}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer with user info & sign out */}
        <div className="px-5 py-4 border-t border-gray-200">
          <p className="text-[11px] text-gray-500 truncate">{user?.email ?? 'Not signed in'}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[10px] text-gray-400">v0.5.0</p>
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3 h-3" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-gray-600 hover:text-gray-900">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-[14px] font-semibold text-gray-900 tracking-tight">
            Founder<span className="text-amber-500">OS</span>
          </h1>
        </div>
        <div className="px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
