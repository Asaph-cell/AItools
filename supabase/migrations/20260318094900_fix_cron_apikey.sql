
-- Fix: Replace the cron job to use a hardcoded apikey header
-- (current_setting('app.supabase_anon_key') was not configured).
-- Since verify_jwt = false on sync-tools, the apikey is just for routing,
-- not for auth. We use the publishable key from the project.

SELECT cron.unschedule('sync-ai-tools-daily');

SELECT cron.schedule(
  'sync-ai-tools-daily',
  '0 3 * * *',
  $$
    SELECT net.http_post(
      url     := 'https://hsdhcvzeyprtznkingat.supabase.co/functions/v1/sync-tools',
      headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_uTAqzhXhjCQbeRqHewQEjg_eXiRSDAH"}'::jsonb,
      body    := '{}'::jsonb
    );
  $$
);
