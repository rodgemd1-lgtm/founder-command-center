import { supabase } from '@/lib/supabase'
import type { Note } from '@/types'

const STORAGE_KEY = 'founder-notes'

function getLocalNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export async function getNotes(businessId?: string): Promise<Note[]> {
  if (supabase) {
    try {
      let query = supabase.from('notes').select('*').order('updated_at', { ascending: false })
      if (businessId) query = query.eq('business_id', businessId)
      const { data, error } = await query
      if (error) throw error
      return (data ?? []).map(row => ({
        id: row.id,
        title: row.title,
        content: row.content ?? '',
        tags: row.tags ?? [],
        businessId: row.business_id ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    } catch (err) {
      console.warn('Supabase getNotes failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalNotes()
  return businessId ? local.filter(n => n.businessId === businessId) : local
}

export async function createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, userId?: string): Promise<Note> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('notes').insert({
        title: note.title,
        content: note.content,
        tags: note.tags,
        business_id: note.businessId || null,
        user_id: userId || null,
      }).select().single()
      if (error) throw error
      return {
        id: data.id,
        title: data.title,
        content: data.content ?? '',
        tags: data.tags ?? [],
        businessId: data.business_id ?? undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (err) {
      console.warn('Supabase createNote failed, falling back to localStorage:', err)
    }
  }
  const newNote: Note = {
    ...note,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const local = getLocalNotes()
  local.unshift(newNote)
  saveLocalNotes(local)
  return newNote
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  if (supabase) {
    try {
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (updates.title !== undefined) payload.title = updates.title
      if (updates.content !== undefined) payload.content = updates.content
      if (updates.tags !== undefined) payload.tags = updates.tags
      if (updates.businessId !== undefined) payload.business_id = updates.businessId || null

      const { data, error } = await supabase.from('notes').update(payload).eq('id', id).select().single()
      if (error) throw error
      return {
        id: data.id,
        title: data.title,
        content: data.content ?? '',
        tags: data.tags ?? [],
        businessId: data.business_id ?? undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (err) {
      console.warn('Supabase updateNote failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalNotes()
  const idx = local.findIndex(n => n.id === id)
  if (idx === -1) throw new Error('Note not found')
  local[idx] = { ...local[idx], ...updates, updatedAt: new Date().toISOString() }
  saveLocalNotes(local)
  return local[idx]
}

export async function deleteNote(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
      return
    } catch (err) {
      console.warn('Supabase deleteNote failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalNotes()
  saveLocalNotes(local.filter(n => n.id !== id))
}
