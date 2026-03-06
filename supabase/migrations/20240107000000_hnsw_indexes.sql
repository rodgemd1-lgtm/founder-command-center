-- Create HNSW vector indexes for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding ON knowledge_chunks
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_decisions_embedding ON decisions
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_research_log_embedding ON research_log
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_customer_intel_embedding ON customer_intel
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- Create B-tree indexes on business_id for filtered queries
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_business_id ON knowledge_chunks(business_id);
CREATE INDEX IF NOT EXISTS idx_decisions_business_id ON decisions(business_id);
CREATE INDEX IF NOT EXISTS idx_research_log_business_id ON research_log(business_id);
CREATE INDEX IF NOT EXISTS idx_customer_intel_business_id ON customer_intel(business_id);
CREATE INDEX IF NOT EXISTS idx_daily_actions_business_id ON daily_actions(business_id);

-- Create index on morning_briefings date for reverse chronological queries
CREATE INDEX IF NOT EXISTS idx_morning_briefings_date ON morning_briefings(briefing_date DESC);
