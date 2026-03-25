-- Schedule enrich-tools to run every 6 hours (offset by 1.5h from sync-tools)
SELECT cron.schedule(
  'enrich-ai-tools',
  '30 1,7,13,19 * * *',
  $$
    SELECT net.http_post(
      url     := 'https://hsdhcvzeyprtznkingat.supabase.co/functions/v1/enrich-tools',
      headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_uTAqzhXhjCQbeRqHewQEjg_eXiRSDAH"}'::jsonb,
      body    := '{}'::jsonb
    );
  $$
);

-- Schedule generate-content to run daily at 5 AM UTC
SELECT cron.schedule(
  'generate-ai-content',
  '0 5 * * *',
  $$
    SELECT net.http_post(
      url     := 'https://hsdhcvzeyprtznkingat.supabase.co/functions/v1/generate-content',
      headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_uTAqzhXhjCQbeRqHewQEjg_eXiRSDAH"}'::jsonb,
      body    := '{}'::jsonb
    );
  $$
);
