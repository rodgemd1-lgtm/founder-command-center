-- Fix match_knowledge to include 'all' business_id chunks in results
-- Previously only matched exact business_id, missing universal knowledge

CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding VECTOR(1536),
  match_business_id TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  business_id TEXT,
  title TEXT,
  content TEXT,
  source_type TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.business_id,
    kc.title,
    kc.content,
    kc.source_type,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE (kc.business_id = match_business_id OR kc.business_id = 'all')
    AND kc.embedding IS NOT NULL
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Fix match_decisions similarly
CREATE OR REPLACE FUNCTION match_decisions(
  query_embedding VECTOR(1536),
  match_business_id TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  business_id TEXT,
  title TEXT,
  description TEXT,
  outcome TEXT,
  lessons_learned TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.business_id,
    d.title,
    d.description,
    d.outcome,
    d.lessons_learned,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM decisions d
  WHERE (d.business_id = match_business_id OR d.business_id = 'all')
    AND d.embedding IS NOT NULL
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
