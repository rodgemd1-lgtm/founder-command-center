import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'on-track': return 'text-emerald-400'
    case 'active': return 'text-emerald-400'
    case 'at-risk': return 'text-amber-400'
    case 'blocked': return 'text-red-400'
    case 'pre-launch': return 'text-slate-400'
    case 'deferred': return 'text-slate-500'
    default: return 'text-slate-400'
  }
}

export function getStatusDot(status: string): string {
  switch (status) {
    case 'on-track': case 'active': return 'bg-emerald-400'
    case 'at-risk': return 'bg-amber-400'
    case 'blocked': return 'bg-red-400'
    default: return 'bg-slate-500'
  }
}

export function getProgressColor(pct: number): string {
  if (pct >= 75) return 'bg-emerald-500'
  if (pct >= 50) return 'bg-brand-500'
  if (pct >= 25) return 'bg-amber-500'
  return 'bg-red-500'
}

export function formatDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}
