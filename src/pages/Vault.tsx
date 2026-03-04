import { useState } from 'react'
import { Eye, EyeOff, Copy, Plus, Trash2, KeyRound } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import type { VaultEntry } from '@/types'
import toast from 'react-hot-toast'

const defaultEntries: VaultEntry[] = [
  { id: '1', label: 'Supabase URL (TransformFit)', category: 'Database', value: '', service: 'Supabase', updatedAt: '' },
  { id: '2', label: 'Supabase Anon Key (TransformFit)', category: 'Database', value: '', service: 'Supabase', updatedAt: '' },
  { id: '3', label: 'Supabase URL (Viral Architect)', category: 'Database', value: '', service: 'Supabase', updatedAt: '' },
  { id: '4', label: 'Anthropic API Key', category: 'AI', value: '', service: 'Anthropic', updatedAt: '' },
  { id: '5', label: 'OpenAI API Key', category: 'AI', value: '', service: 'OpenAI', updatedAt: '' },
  { id: '6', label: 'Stripe Secret Key (TransformFit)', category: 'Payments', value: '', service: 'Stripe', updatedAt: '' },
  { id: '7', label: 'Stripe Secret Key (Viral Architect)', category: 'Payments', value: '', service: 'Stripe', updatedAt: '' },
  { id: '8', label: 'Meta App ID', category: 'Social', value: '', service: 'Meta', updatedAt: '' },
  { id: '9', label: 'Meta App Secret', category: 'Social', value: '', service: 'Meta', updatedAt: '' },
  { id: '10', label: 'Vercel Token', category: 'Hosting', value: '', service: 'Vercel', updatedAt: '' },
  { id: '11', label: 'Railway Token', category: 'Hosting', value: '', service: 'Railway', updatedAt: '' },
  { id: '12', label: 'PostHog API Key', category: 'Analytics', value: '', service: 'PostHog', updatedAt: '' },
  { id: '13', label: 'GitHub Token', category: 'Dev', value: '', service: 'GitHub', updatedAt: '' },
]

const categories = ['All', 'Database', 'AI', 'Payments', 'Social', 'Hosting', 'Analytics', 'Dev']

function loadVault(): VaultEntry[] {
  try {
    const stored = localStorage.getItem('founder-vault')
    return stored ? JSON.parse(stored) : defaultEntries
  } catch {
    return defaultEntries
  }
}

function saveVault(entries: VaultEntry[]) {
  localStorage.setItem('founder-vault', JSON.stringify(entries))
}

export function Vault() {
  const [entries, setEntries] = useState<VaultEntry[]>(loadVault)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [newEntry, setNewEntry] = useState({ label: '', category: 'Dev', value: '', service: '' })

  const filtered = categoryFilter === 'All' ? entries : entries.filter(e => e.category === categoryFilter)

  const toggleReveal = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const copyValue = (entry: VaultEntry) => {
    if (!entry.value) {
      toast.error('No value set')
      return
    }
    navigator.clipboard.writeText(entry.value)
    toast.success(`Copied ${entry.label}`)
  }

  const updateValue = (id: string, value: string) => {
    const updated = entries.map(e =>
      e.id === id ? { ...e, value, updatedAt: new Date().toISOString() } : e
    )
    setEntries(updated)
    saveVault(updated)
  }

  const addEntry = () => {
    if (!newEntry.label) return
    const entry: VaultEntry = {
      id: generateId(),
      label: newEntry.label,
      category: newEntry.category,
      value: newEntry.value,
      service: newEntry.service || newEntry.label,
      updatedAt: new Date().toISOString(),
    }
    const updated = [...entries, entry]
    setEntries(updated)
    saveVault(updated)
    setNewEntry({ label: '', category: 'Dev', value: '', service: '' })
    setShowAdd(false)
    toast.success('Entry added')
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    saveVault(updated)
    toast.success('Entry deleted')
  }

  const exportEnv = () => {
    const envContent = entries
      .filter(e => e.value)
      .map(e => `${e.label.toUpperCase().replace(/[^A-Z0-9]/g, '_')}=${e.value}`)
      .join('\n')
    navigator.clipboard.writeText(envContent)
    toast.success('Exported to clipboard as .env format')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-label tracking-tight">Vault</h1>
          <p className="text-[15px] text-label-secondary mt-1">
            API keys, credentials & secrets. Stored locally in your browser.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportEnv}
            className="text-[11px] px-3 py-1.5 rounded-lg glass text-label-tertiary hover:text-label transition-fast"
          >
            Export .env
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-accent text-canvas font-medium hover:bg-accent-hover transition-fast flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="glass rounded-xl p-4 space-y-3 animate-scale-in border-accent/20">
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={newEntry.label}
              onChange={e => setNewEntry(p => ({ ...p, label: e.target.value }))}
              placeholder="Label (e.g. Stripe Secret Key)"
              className="bg-surface border border-separator-subtle rounded-lg px-3 py-2 text-[13px] text-label placeholder:text-label-quaternary focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
            <select
              value={newEntry.category}
              onChange={e => setNewEntry(p => ({ ...p, category: e.target.value }))}
              className="bg-surface border border-separator-subtle rounded-lg px-3 py-2 text-[13px] text-label focus:outline-none"
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="password"
              value={newEntry.value}
              onChange={e => setNewEntry(p => ({ ...p, value: e.target.value }))}
              placeholder="Value"
              className="bg-surface border border-separator-subtle rounded-lg px-3 py-2 text-[13px] text-label placeholder:text-label-quaternary focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>
          <button
            onClick={addEntry}
            className="text-[11px] px-4 py-1.5 bg-accent text-canvas rounded-lg font-medium hover:bg-accent-hover transition-fast"
          >
            Save
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-fast',
              categoryFilter === c
                ? 'bg-accent-muted text-accent'
                : 'text-label-quaternary hover:text-label-tertiary'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {filtered.map(entry => (
          <div
            key={entry.id}
            className="glass rounded-xl px-4 py-3.5 flex items-center gap-4 hover:glow-accent transition-base"
          >
            <KeyRound className="w-4 h-4 text-label-quaternary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-label">{entry.label}</p>
              <p className="text-[10px] text-label-quaternary">{entry.category} · {entry.service}</p>
            </div>
            <div className="flex-1 min-w-0">
              {entry.value ? (
                <code className="text-[12px] font-mono text-label-tertiary">
                  {revealed.has(entry.id) ? entry.value : '••••••••••••'}
                </code>
              ) : (
                <input
                  type="password"
                  placeholder="Set value..."
                  className="bg-transparent text-[12px] text-label-tertiary placeholder:text-label-quaternary focus:outline-none w-full font-mono"
                  onBlur={e => { if (e.target.value) updateValue(entry.id, e.target.value) }}
                  onKeyDown={e => { if (e.key === 'Enter') { updateValue(entry.id, (e.target as HTMLInputElement).value) } }}
                />
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {entry.value && (
                <>
                  <button
                    onClick={() => toggleReveal(entry.id)}
                    className="p-1.5 rounded-md hover:bg-surface text-label-quaternary hover:text-label-secondary transition-fast"
                  >
                    {revealed.has(entry.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyValue(entry)}
                    className="p-1.5 rounded-md hover:bg-surface text-label-quaternary hover:text-label-secondary transition-fast"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <button
                onClick={() => deleteEntry(entry.id)}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-label-quaternary hover:text-destructive transition-fast"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-warning/5 border border-warning/10 rounded-xl px-4 py-3 text-[11px] text-warning/80 leading-relaxed">
        <strong>Security note:</strong> Values are stored in your browser's localStorage. For production use, connect Supabase to store encrypted secrets server-side. Never commit secrets to git.
      </div>
    </div>
  )
}
