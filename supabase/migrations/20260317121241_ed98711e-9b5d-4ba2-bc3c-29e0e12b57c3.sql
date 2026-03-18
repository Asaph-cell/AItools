
ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS click_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS quiz_match_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS comparison_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS trend_score numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS screenshot_url text,
ADD COLUMN IF NOT EXISTS pros text[],
ADD COLUMN IF NOT EXISTS cons text[],
ADD COLUMN IF NOT EXISTS key_features text[];
