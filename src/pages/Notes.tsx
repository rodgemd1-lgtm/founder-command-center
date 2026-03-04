import { useState } from 'react'
import { Plus, Trash2, Save, Tag } from 'lucide-react'
import { cn, generateId, formatDate } from '@/lib/utils'
import { businesses } from '@/lib/data'
import type { Note } from '@/types'

function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem('founder-notes')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem('founder-notes', JSON.stringify(notes))
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editBusiness, setEditBusiness] = useState<string>('')
  const [editTags, setEditTags] = useState('')

  const selected = notes.find(n => n.id === selectedId)

  const createNote = () => {
    const note: Note = {
      id: generateId(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [note, ...notes]
    setNotes(updated)
    saveNotes(updated)
    selectNote(note)
  }

  const selectNote = (note: Note) => {
    setSelectedId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditBusiness(note.businessId || '')
    setEditTags(note.tags.join(', '))
  }

  const saveNote = () => {
    if (!selectedId) return
    const updated = notes.map(n =>
      n.id === selectedId
        ? {
            ...n,
            title: editTitle,
            content: editContent,
            businessId: editBusiness || undefined,
            tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
            updatedAt: new Date().toISOString(),
          }
        : n
    )
    setNotes(updated)
    saveNotes(updated)
  }

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    saveNotes(updated)
    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notes</h1>
          <p className="text-slate-400 mt-1">Meeting notes, ideas, and decisions. Tag by business.</p>
        </div>
        <button
          onClick={createNote}
          className="text-xs px-3 py-1.5 rounded-lg bg-brand-500 text-black font-medium hover:bg-brand-600 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> New Note
        </button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Notes List */}
        <div className="w-72 shrink-0 bg-surface-1 border border-slate-800 rounded-xl overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No notes yet. Create one to get started.
            </div>
          ) : (
            notes.map(note => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-slate-800/50 transition-colors',
                  selectedId === note.id ? 'bg-surface-2' : 'hover:bg-surface-2/50'
                )}
              >
                <p className={cn('text-sm font-medium truncate', selectedId === note.id ? 'text-white' : 'text-slate-300')}>
                  {note.title}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {formatDate(note.updatedAt)}
                  {note.businessId && ` · ${businesses.find(b => b.id === note.businessId)?.name || note.businessId}`}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-3 text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 bg-surface-1 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="flex-1 bg-transparent text-lg font-semibold text-white focus:outline-none"
                  placeholder="Note title..."
                />
                <select
                  value={editBusiness}
                  onChange={e => setEditBusiness(e.target.value)}
                  className="bg-surface-2 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="">No business</option>
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <button onClick={saveNote} className="p-1.5 rounded-md hover:bg-surface-2 text-slate-400 hover:text-brand-400">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => deleteNote(selected.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 py-2 border-b border-slate-800/50 flex items-center gap-2">
                <Tag className="w-3 h-3 text-slate-500" />
                <input
                  type="text"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-slate-400 focus:outline-none"
                  placeholder="Tags (comma separated)..."
                />
              </div>

              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                onBlur={saveNote}
                className="flex-1 bg-transparent text-sm text-slate-300 leading-relaxed p-4 resize-none focus:outline-none font-mono"
                placeholder="Start typing your note..."
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
