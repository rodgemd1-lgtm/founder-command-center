import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, Tag, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn, formatDate } from '@/lib/utils'
import { businesses } from '@/lib/data'
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/notes'
import { useAuth } from '@/hooks/useAuth'
import type { Note } from '@/types'

export function Notes() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editBusiness, setEditBusiness] = useState<string>('')
  const [editTags, setEditTags] = useState('')

  const selected = notes.find(n => n.id === selectedId)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    setIsLoading(true)
    try {
      const data = await getNotes()
      setNotes(data)
    } catch (err) {
      console.warn('Failed to load notes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const note = await createNote({
        title: 'Untitled Note',
        content: '',
        tags: [],
      }, user?.id)
      setNotes(prev => [note, ...prev])
      selectNote(note)
      toast.success('Note created')
    } catch (err) {
      console.warn('Failed to create note:', err)
      toast.error('Failed to create note')
    }
  }

  const selectNote = (note: Note) => {
    setSelectedId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditBusiness(note.businessId || '')
    setEditTags(note.tags.join(', '))
  }

  const handleSave = async () => {
    if (!selectedId) return
    try {
      const updated = await updateNote(selectedId, {
        title: editTitle,
        content: editContent,
        businessId: editBusiness || undefined,
        tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      })
      setNotes(prev => prev.map(n => n.id === selectedId ? updated : n))
      toast.success('Note saved')
    } catch (err) {
      console.warn('Failed to save note:', err)
      toast.error('Failed to save note')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => n.id !== id))
      if (selectedId === id) setSelectedId(null)
      toast.success('Note deleted')
    } catch (err) {
      console.warn('Failed to delete note:', err)
      toast.error('Failed to delete note')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Meeting notes, ideas, and decisions. Tag by business.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Note
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="flex gap-4 h-[calc(100vh-220px)]">
          {/* Notes List */}
          <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No notes yet. Create one to get started.
              </div>
            ) : (
              notes.map(note => (
                <button
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={cn(
                    'w-full text-left px-4 py-3 border-b border-gray-100 transition-colors',
                    selectedId === note.id ? 'bg-amber-50' : 'hover:bg-gray-50'
                  )}
                >
                  <p className={cn(
                    'text-sm font-medium truncate',
                    selectedId === note.id ? 'text-amber-700' : 'text-gray-700'
                  )}>
                    {note.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {formatDate(note.updatedAt)}
                    {note.businessId && ` · ${businesses.find(b => b.slug === note.businessId)?.name || note.businessId}`}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
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
          <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
            {selected ? (
              <>
                <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="flex-1 bg-transparent text-lg font-semibold text-gray-900 focus:outline-none"
                    placeholder="Note title..."
                  />
                  <select
                    value={editBusiness}
                    onChange={e => setEditBusiness(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none"
                  >
                    <option value="">No business</option>
                    {businesses.map(b => (
                      <option key={b.slug} value={b.slug}>{b.name}</option>
                    ))}
                  </select>
                  <button onClick={handleSave} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-amber-600 transition-colors">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-gray-500 focus:outline-none"
                    placeholder="Tags (comma separated)..."
                  />
                </div>

                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  onBlur={handleSave}
                  className="flex-1 bg-transparent text-sm text-gray-700 leading-relaxed p-4 resize-none focus:outline-none font-mono"
                  placeholder="Start typing your note..."
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select a note or create a new one
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
