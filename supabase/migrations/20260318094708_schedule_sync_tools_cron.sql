
-- Schedule the sync-tools edge function to run every day at 3:00 AM UTC.
-- This auto-discovers new AI tools, deduplicates them, and recalculates
-- trend scores for every tool in the database.
--
-- Prerequisites (already applied in earlier migrations):
--   CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
--   CREATE EXTENSION IF NOT EXISTS pg_net  WITH SCHEMA extensions;
--
-- To cancel the job later:
--   SELECT cron.unschedule('sync-ai-tools-daily');

SELECT cron.schedule(
  'sync-ai-tools-daily',          -- unique job name
  '0 3 * * *',                    -- every day at 03:00 UTC
  $$
    SELECT net.http_post(
      url     := 'https://hsdhcvzeyprtznkingat.supabase.co/functions/v1/sync-tools',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', current_setting('app.supabase_anon_key', true)
      ),
      body    := '{}'::jsonb
    );
  $$
);
