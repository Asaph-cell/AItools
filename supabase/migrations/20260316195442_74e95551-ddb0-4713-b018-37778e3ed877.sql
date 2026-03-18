
-- Create ai_tools table
CREATE TABLE public.ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  website_url TEXT,
  affiliate_url TEXT,
  logo_url TEXT,
  category TEXT,
  skill_level TEXT,
  pricing TEXT,
  platform TEXT,
  primary_use_case TEXT,
  tags TEXT[],
  rating NUMERIC,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view ai_tools" ON public.ai_tools
  FOR SELECT USING (true);
