-- Set up automated cron jobs for Founder Command Center
-- 1. Morning briefing: daily at 6 AM ET (10:00 UTC)
-- 2. Weekly research: Mondays at 4 AM ET (08:00 UTC)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage on cron schema to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- 1. Daily morning briefing — 6 AM ET (10:00 UTC) every day
SELECT cron.schedule(
  'generate-morning-briefing',
  '0 10 * * *',  -- 10:00 UTC = 6:00 AM ET
  $$
  SELECT net.http_post(
    url := 'https://jmpywetvmcznqfllqkeg.supabase.co/functions/v1/generate-briefing',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHl3ZXR2bWN6bnFmbGxxa2VnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjYzNjE2NywiZXhwIjoyMDg4MjEyMTY3fQ.MM5xdTqZhL4tadAwa5Qg1HNujEzaOY_6SAkTo4O8wZ4'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 2. Weekly research — Mondays at 4 AM ET (08:00 UTC)
SELECT cron.schedule(
  'run-weekly-research',
  '0 8 * * 1',  -- 08:00 UTC Monday = 4:00 AM ET Monday
  $$
  SELECT net.http_post(
    url := 'https://jmpywetvmcznqfllqkeg.supabase.co/functions/v1/run-research',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHl3ZXR2bWN6bnFmbGxxa2VnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjYzNjE2NywiZXhwIjoyMDg4MjEyMTY3fQ.MM5xdTqZhL4tadAwa5Qg1HNujEzaOY_6SAkTo4O8wZ4'
    ),
    body := '{}'::jsonb
  );
  $$
);
