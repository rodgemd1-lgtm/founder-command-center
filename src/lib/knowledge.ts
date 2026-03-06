import { supabase } from '@/lib/supabase'

export interface KnowledgeChunk {
  id: string
  business_id: string
  source_type: string
  source_path?: string
  title: string
  content: string
  metadata: Record<string, unknown>
  chunk_index: number
  created_at: string
}

export async function queryKnowledge(businessId: string, query: string, limit = 5): Promise<KnowledgeChunk[]> {
  if (!supabase) return []

  try {
    // Call the rag-query edge function
    const { data, error } = await supabase.functions.invoke('rag-query', {
      body: { business_id: businessId, query, limit }
    })
    if (error) throw error
    return data?.chunks ?? []
  } catch (err) {
    console.warn('Knowledge query failed, returning empty results:', err)
    return []
  }
}

export async function ingestDocument(businessId: string, title: string, content: string, sourceType: string, sourcePath?: string): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured — document not ingested')
    return
  }

  try {
    const { error } = await supabase.functions.invoke('ingest-document', {
      body: { business_id: businessId, title, content, source_type: sourceType, source_path: sourcePath }
    })
    if (error) throw error
  } catch (err) {
    console.warn('Document ingestion failed:', err)
  }
}

export async function getRecentKnowledge(businessId: string, limit = 20): Promise<KnowledgeChunk[]> {
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as KnowledgeChunk[]
  } catch (err) {
    console.warn('getRecentKnowledge failed, returning empty results:', err)
    return []
  }
}
