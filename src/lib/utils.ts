import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'on-track': return 'text-emerald-700'
    case 'active': return 'text-emerald-700'
    case 'completed': return 'text-emerald-700'
    case 'done': return 'text-emerald-700'
    case 'at-risk': return 'text-amber-700'
    case 'in-progress': return 'text-amber-700'
    case 'partial': return 'text-amber-700'
    case 'blocked': return 'text-red-700'
    case 'critical': return 'text-red-700'
    case 'pre-launch': return 'text-gray-600'
    case 'deferred': return 'text-gray-600'
    default: return 'text-gray-600'
  }
}

export function getStatusDot(status: string): string {
  switch (status) {
    case 'on-track': case 'active': case 'completed': case 'done': return 'bg-emerald-600'
    case 'at-risk': case 'in-progress': case 'partial': return 'bg-amber-600'
    case 'blocked': case 'critical': return 'bg-red-600'
    default: return 'bg-gray-400'
  }
}

export function getProgressColor(pct: number): string {
  if (pct >= 80) return 'bg-emerald-600'
  if (pct >= 60) return 'bg-amber-500'
  if (pct >= 40) return 'bg-amber-600'
  return 'bg-red-500'
}

export function formatDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}
