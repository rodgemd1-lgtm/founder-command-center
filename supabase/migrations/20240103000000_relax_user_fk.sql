-- Relax user_id foreign key constraints to allow system/seed data insertion
-- In a single-founder app, RLS + service role key is sufficient security

-- Drop FK constraints on user_id (keep the column for future auth integration)
ALTER TABLE decisions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE decisions DROP CONSTRAINT IF EXISTS decisions_user_id_fkey;

ALTER TABLE knowledge_chunks ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE knowledge_chunks DROP CONSTRAINT IF EXISTS knowledge_chunks_user_id_fkey;

ALTER TABLE customer_intel ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE customer_intel DROP CONSTRAINT IF EXISTS customer_intel_user_id_fkey;

ALTER TABLE research_log ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE research_log DROP CONSTRAINT IF EXISTS research_log_user_id_fkey;

ALTER TABLE morning_briefings ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE morning_briefings DROP CONSTRAINT IF EXISTS morning_briefings_user_id_fkey;

ALTER TABLE daily_actions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE daily_actions DROP CONSTRAINT IF EXISTS daily_actions_user_id_fkey;

-- Add permissive policies for service-role and anon access (single-user app)
-- These allow the edge functions and seed scripts to write data
CREATE POLICY "Service role full access decisions" ON decisions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access knowledge" ON knowledge_chunks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access research" ON research_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access briefings" ON morning_briefings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access actions" ON daily_actions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access customer_intel" ON customer_intel FOR ALL USING (true) WITH CHECK (true);

-- Also add source_type values for ingested knowledge types
ALTER TABLE research_log DROP CONSTRAINT IF EXISTS research_log_source_type_check;
ALTER TABLE research_log ADD CONSTRAINT research_log_source_type_check 
  CHECK (source_type IN ('youtube', 'reddit', 'web', 'paper', 'manual', 'persona', 'framework', 'skill', 'document'));
