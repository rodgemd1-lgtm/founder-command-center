CREATE TABLE IF NOT EXISTS scrape_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  api_source text NOT NULL DEFAULT 'brave',
  result_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_scrape_log_created_at ON scrape_log(created_at);

ALTER TABLE scrape_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on scrape_log" ON scrape_log
  FOR ALL USING (
    (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
  );
