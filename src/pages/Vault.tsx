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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vault</h1>
          <p className="text-slate-400 mt-1">API keys, credentials & secrets. Stored locally in your browser.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportEnv}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-2 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            Export .env
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs px-3 py-1.5 rounded-lg bg-brand-500 text-black font-medium hover:bg-brand-600 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-surface-1 border border-brand-500/30 rounded-xl p-4 space-y-3 animate-fade-in">
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={newEntry.label}
              onChange={e => setNewEntry(p => ({ ...p, label: e.target.value }))}
              placeholder="Label (e.g. Stripe Secret Key)"
              className="bg-surface-2 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <select
              value={newEntry.category}
              onChange={e => setNewEntry(p => ({ ...p, category: e.target.value }))}
              className="bg-surface-2 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
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
              className="bg-surface-2 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button onClick={addEntry} className="text-xs px-4 py-1.5 bg-brand-500 text-black rounded-lg font-medium">
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
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              categoryFilter === c
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                : 'text-slate-500 hover:text-slate-300 border border-transparent'
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
            className="bg-surface-1 border border-slate-800 rounded-lg px-4 py-3 flex items-center gap-4 hover:border-slate-700 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-slate-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{entry.label}</p>
              <p className="text-[10px] text-slate-500">{entry.category} · {entry.service}</p>
            </div>
            <div className="flex-1 min-w-0">
              {entry.value ? (
                <code className="text-xs font-mono text-slate-400">
                  {revealed.has(entry.id) ? entry.value : '••••••••••••'}
                </code>
              ) : (
                <input
                  type="password"
                  placeholder="Set value..."
                  className="bg-transparent text-xs text-slate-400 placeholder:text-slate-600 focus:outline-none w-full font-mono"
                  onBlur={e => { if (e.target.value) updateValue(entry.id, e.target.value) }}
                  onKeyDown={e => { if (e.key === 'Enter') { updateValue(entry.id, (e.target as HTMLInputElement).value) } }}
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              {entry.value && (
                <>
                  <button onClick={() => toggleReveal(entry.id)} className="p-1.5 rounded-md hover:bg-surface-2 text-slate-500 hover:text-slate-300">
                    {revealed.has(entry.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => copyValue(entry)} className="p-1.5 rounded-md hover:bg-surface-2 text-slate-500 hover:text-slate-300">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <button onClick={() => deleteEntry(entry.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-600 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3 text-xs text-amber-300/80 leading-relaxed">
        <strong>Security note:</strong> Values are stored in your browser's localStorage. For production use, connect Supabase to store encrypted secrets server-side. Never commit secrets to git.
      </div>
    </div>
  )
}
