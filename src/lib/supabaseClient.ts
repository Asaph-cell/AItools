// Re-export from the auto-generated integration
export { supabase } from "@/integrations/supabase/client";

export type AiTool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  website_url: string;
  affiliate_url: string | null;
  logo_url: string | null;
  category: string;
  skill_level: string;
  pricing: string;
  platform: string;
  primary_use_case: string;
  tags: string[];
  rating: number | null;
  featured: boolean;
  created_at: string;
  click_count: number;
  quiz_match_count: number;
  comparison_count: number;
  trend_score: number;
  screenshot_url: string | null;
  pros: string[] | null;
  cons: string[] | null;
  key_features: string[] | null;
};
