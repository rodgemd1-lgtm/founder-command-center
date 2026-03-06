-- Insert the service role key into Supabase Vault for cron job auth
-- First clean up any partial row from a failed attempt
DELETE FROM vault.secrets WHERE name = 'service_role_key';

-- Insert using vault.create_secret with the project's service role JWT
SELECT vault.create_secret(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcHl3ZXR2bWN6bnFmbGxxa2VnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjYzNjE2NywiZXhwIjoyMDg4MjEyMTY3fQ.MM5xdTqZhL4tadAwa5Qg1HNujEzaOY_6SAkTo4O8wZ4',
  'service_role_key',
  'Service role JWT for cron job Authorization headers'
);
