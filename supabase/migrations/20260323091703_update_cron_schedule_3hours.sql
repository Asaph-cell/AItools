-- Update the cron job to run every 3 hours instead of daily
-- to get the most out of sources.

SELECT cron.unschedule('sync-ai-tools-daily');

SELECT cron.schedule(
  'sync-ai-tools-daily',
  '0 */3 * * *',
  $$
    SELECT net.http_post(
      url     := 'https://hsdhcvzeyprtznkingat.supabase.co/functions/v1/sync-tools',
      headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_uTAqzhXhjCQbeRqHewQEjg_eXiRSDAH"}'::jsonb,
      body    := '{}'::jsonb
    );
  $$
);