-- Fix cron job security: remove hardcoded service role key
-- The previous migration (20240104000000_cron_jobs.sql) embedded the service role
-- JWT directly in the SQL, which means it is readable by any Postgres superuser
-- and is committed in git history. This migration:
--   1. Unschedules the insecure cron jobs.
--   2. Re-creates them so the Authorization header value is resolved at runtime
--      from the Supabase Vault secret named 'service_role_key'.
--
-- Before deploying, store the key in Vault via the Supabase dashboard:
--   Dashboard → Database → Vault → New secret
--   Name:  service_role_key
--   Value: <your service role JWT>
--
-- The function below is a thin wrapper that reads from vault.decrypted_secrets
-- so that the raw JWT never appears in the cron schedule definition.

-- ----------------------------------------------------------------
-- 1. Remove the insecure existing jobs
-- ----------------------------------------------------------------
SELECT cron.unschedule('generate-morning-briefing');
SELECT cron.unschedule('run-weekly-research');

-- Ensure the private schema exists
CREATE SCHEMA IF NOT EXISTS private;

-- ----------------------------------------------------------------
-- 2. Helper function: read service role key from Vault at call time
--    Security: SECURITY DEFINER + search_path locked to prevent
--    search-path hijacking. Only the postgres role can execute this;
--    it is NOT granted to authenticated/anon roles.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION private.get_service_role_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = vault, pg_temp
AS $$
DECLARE
  v_key TEXT;
BEGIN
  SELECT decrypted_secret
    INTO STRICT v_key
    FROM vault.decrypted_secrets
   WHERE name = 'service_role_key';

  RETURN v_key;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE EXCEPTION 'Vault secret "service_role_key" not found. '
      'Add it via Dashboard → Database → Vault before running cron jobs.';
  WHEN TOO_MANY_ROWS THEN
    RAISE EXCEPTION 'Multiple vault secrets named "service_role_key" found. '
      'Remove duplicates in the Supabase Vault UI.';
END;
$$;

-- Revoke public execution; only postgres (cron owner) may call this
REVOKE ALL ON FUNCTION private.get_service_role_key() FROM PUBLIC;

-- ----------------------------------------------------------------
-- 3. Re-schedule the cron jobs using the vault helper
--    The bearer token is resolved by calling private.get_service_role_key()
--    inside the job body, so the literal JWT never appears here.
-- ----------------------------------------------------------------

-- 3a. Daily morning briefing — 6 AM ET (10:00 UTC)
SELECT cron.schedule(
  'generate-morning-briefing',
  '0 10 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://jmpywetvmcznqfllqkeg.supabase.co/functions/v1/generate-briefing',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || private.get_service_role_key()
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- 3b. Weekly research — Mondays at 4 AM ET (08:00 UTC)
SELECT cron.schedule(
  'run-weekly-research',
  '0 8 * * 1',
  $$
  SELECT net.http_post(
    url     := 'https://jmpywetvmcznqfllqkeg.supabase.co/functions/v1/run-research',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || private.get_service_role_key()
    ),
    body    := '{}'::jsonb
  );
  $$
);
