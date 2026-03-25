-- Expand ai_tools with richer data fields
ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS pricing_details JSONB,
ADD COLUMN IF NOT EXISTS integrations TEXT[],
ADD COLUMN IF NOT EXISTS alternatives TEXT[],
ADD COLUMN IF NOT EXISTS last_enriched_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS logo_scraped BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Auto-generated content table for blog/articles/alternatives pages
CREATE TABLE IF NOT EXISTS public.auto_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL,  -- 'alternatives', 'roundup', 'weekly-digest', 'category-guide'
  category TEXT,
  related_tool_ids UUID[],
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.auto_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view auto_content" ON public.auto_content
  FOR SELECT USING (true);

-- Index for fast content lookups
CREATE INDEX IF NOT EXISTS idx_auto_content_type ON public.auto_content(content_type);
CREATE INDEX IF NOT EXISTS idx_auto_content_slug ON public.auto_content(slug);
CREATE INDEX IF NOT EXISTS idx_auto_content_category ON public.auto_content(category);
