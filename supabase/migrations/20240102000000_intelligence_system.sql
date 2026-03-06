-- Founder Command Center — Intelligence System Schema
-- Migration 002: Adds decision log, knowledge RAG, customer intel,
-- research log, morning briefings, and daily actions.
-- Run: supabase db push

-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Decisions table (per-business learning log)
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  business_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('strategy', 'product', 'marketing', 'technical', 'financial', 'hiring', 'legal')),
  outcome TEXT,
  outcome_rating INT CHECK (outcome_rating >= 1 AND outcome_rating <= 10),
  what_worked TEXT,
  what_didnt TEXT,
  lessons_learned TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'reversed')),
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Knowledge chunks (per-business RAG storage)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  business_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_path TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  chunk_index INT DEFAULT 0,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customer intelligence
CREATE TABLE IF NOT EXISTS customer_intel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  business_id TEXT NOT NULL,
  customer_name TEXT,
  segment TEXT,
  feedback TEXT,
  nps_score INT CHECK (nps_score >= 0 AND nps_score <= 10),
  acquisition_channel TEXT,
  mrr_contribution DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  notes TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Research log
CREATE TABLE IF NOT EXISTS research_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  business_id TEXT,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('youtube', 'reddit', 'web', 'paper', 'manual')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_insights TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  embedding VECTOR(1536),
  ingested_at TIMESTAMPTZ DEFAULT now()
);

-- Morning briefings (daily auto-generated)
CREATE TABLE IF NOT EXISTS morning_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  briefing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  priorities JSONB NOT NULL,
  portfolio_summary JSONB NOT NULL,
  research_highlights JSONB,
  monte_carlo_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily task actions
CREATE TABLE IF NOT EXISTS daily_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  business_id TEXT NOT NULL,
  briefing_id UUID REFERENCES morning_briefings(id),
  task TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  outcome TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_decisions_business ON decisions(business_id);
CREATE INDEX IF NOT EXISTS idx_decisions_user ON decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_business ON knowledge_chunks(business_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_user ON knowledge_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_research_business ON research_log(business_id);
CREATE INDEX IF NOT EXISTS idx_research_user ON research_log(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_business ON customer_intel(business_id);
CREATE INDEX IF NOT EXISTS idx_briefings_date ON morning_briefings(briefing_date);
CREATE INDEX IF NOT EXISTS idx_actions_business ON daily_actions(business_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON daily_actions(status);

-- RLS Policies
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_intel ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_actions ENABLE ROW LEVEL SECURITY;

-- Authenticated user policies (user can CRUD their own data)
CREATE POLICY "Users manage own decisions" ON decisions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own knowledge" ON knowledge_chunks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own customer intel" ON customer_intel FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own research" ON research_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own briefings" ON morning_briefings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own actions" ON daily_actions FOR ALL USING (auth.uid() = user_id);

-- Also allow authenticated users without user_id match (for initial data population)
CREATE POLICY "Authenticated read decisions" ON decisions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read knowledge" ON knowledge_chunks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read research" ON research_log FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read briefings" ON morning_briefings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read actions" ON daily_actions FOR SELECT USING (auth.role() = 'authenticated');

-- Vector similarity search function
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
  WHERE kc.business_id = match_business_id
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Decision similarity search
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
  WHERE d.business_id = match_business_id
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
