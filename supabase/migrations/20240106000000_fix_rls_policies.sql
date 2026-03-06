-- Fix RLS policies: replace USING (true) open policies with scoped ones
--
-- Migration 20240103000000_relax_user_fk.sql added six "USING (true)" policies
-- that effectively disable row-level security for every role, including anonymous
-- callers. These are replaced below with policies that enforce:
--
--   SELECT  → authenticated user owns the row  OR  row has no owner (system data)
--              OR the caller is the service_role (edge functions / cron)
--   INSERT  → authenticated user sets themselves as owner  OR  service_role
--   UPDATE  → same as SELECT
--   DELETE  → same as SELECT
--
-- Why keep "user_id IS NULL":
--   Rows inserted by cron/edge functions (morning briefings, research log entries)
--   have no user_id. The authenticated user must still be able to read/edit them.
--
-- Why keep service_role check:
--   Edge functions run with SUPABASE_SERVICE_ROLE_KEY and bypass RLS by default,
--   but being explicit makes the intent auditable and keeps things working if
--   someone ever disables the implicit bypass in a future Supabase version.

-- ================================================================
-- decisions
-- ================================================================
DROP POLICY IF EXISTS "Service role full access decisions"  ON decisions;

-- Re-use the original per-user policy from migration 002 (already exists),
-- but we need to extend it for rows without an owner and for service_role.
-- Drop and recreate so the USING clause is correct.
DROP POLICY IF EXISTS "Users manage own decisions"     ON decisions;
DROP POLICY IF EXISTS "Authenticated read decisions"   ON decisions;

CREATE POLICY "decisions_select"
  ON decisions FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "decisions_insert"
  ON decisions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "decisions_update"
  ON decisions FOR UPDATE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "decisions_delete"
  ON decisions FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

-- ================================================================
-- knowledge_chunks
-- ================================================================
DROP POLICY IF EXISTS "Service role full access knowledge"  ON knowledge_chunks;
DROP POLICY IF EXISTS "Users manage own knowledge"          ON knowledge_chunks;
DROP POLICY IF EXISTS "Authenticated read knowledge"        ON knowledge_chunks;

CREATE POLICY "knowledge_chunks_select"
  ON knowledge_chunks FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "knowledge_chunks_insert"
  ON knowledge_chunks FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "knowledge_chunks_update"
  ON knowledge_chunks FOR UPDATE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "knowledge_chunks_delete"
  ON knowledge_chunks FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

-- ================================================================
-- customer_intel
-- ================================================================
DROP POLICY IF EXISTS "Service role full access customer_intel"  ON customer_intel;
-- No "Users manage own customer intel" policy existed in 002; create fresh.

CREATE POLICY "customer_intel_select"
  ON customer_intel FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "customer_intel_insert"
  ON customer_intel FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "customer_intel_update"
  ON customer_intel FOR UPDATE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "customer_intel_delete"
  ON customer_intel FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

-- ================================================================
-- research_log
-- ================================================================
DROP POLICY IF EXISTS "Service role full access research"  ON research_log;
DROP POLICY IF EXISTS "Users manage own research"          ON research_log;
DROP POLICY IF EXISTS "Authenticated read research"        ON research_log;

CREATE POLICY "research_log_select"
  ON research_log FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "research_log_insert"
  ON research_log FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "research_log_update"
  ON research_log FOR UPDATE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "research_log_delete"
  ON research_log FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

-- ================================================================
-- morning_briefings
-- ================================================================
DROP POLICY IF EXISTS "Service role full access briefings"  ON morning_briefings;
DROP POLICY IF EXISTS "Users manage own briefings"          ON morning_briefings;
DROP POLICY IF EXISTS "Authenticated read briefings"        ON morning_briefings;

CREATE POLICY "morning_briefings_select"
  ON morning_briefings FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "morning_briefings_insert"
  ON morning_briefings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "morning_briefings_update"
  ON morning_briefings FOR UPDATE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "morning_briefings_delete"
  ON morning_briefings FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

-- ================================================================
-- daily_actions
-- ================================================================
DROP POLICY IF EXISTS "Service role full access actions"  ON daily_actions;
DROP POLICY IF EXISTS "Users manage own actions"          ON daily_actions;
DROP POLICY IF EXISTS "Authenticated read actions"        ON daily_actions;

CREATE POLICY "daily_actions_select"
  ON daily_actions FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "daily_actions_insert"
  ON daily_actions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "daily_actions_update"
  ON daily_actions FOR UPDATE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );

CREATE POLICY "daily_actions_delete"
  ON daily_actions FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.role() = 'service_role'
  );
