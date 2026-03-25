import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ────────────────────────────────────────────
// CONFIG
// ────────────────────────────────────────────
const CATEGORIES = [
  'marketing', 'design', 'research', 'productivity', 'coding',
  'audio', 'video', 'automation', 'writing', 'education',
  'finance', 'healthcare', 'music', '3D modeling', 'chatbots',
  'customer support', 'HR recruiting', 'legal', 'social media',
  'SEO', 'email', 'spreadsheets', 'data analysis', 'image generation',
  'presentation', 'translation', 'summarization', 'no-code',
];

const QUERY_TEMPLATES = [
  'new AI {category} tool {year}',
  'best AI {category} platform {year}',
  'AI-powered {category} software',
  '{category} AI tool free',
  'AI {category} app online {month} {year}',
  'underrated AI tools for {category}',
  'top {category} AI startup',
  '{category} AI SaaS tool',
];

// Domains that are directories/news, NOT tools themselves
const BLOCKED_DOMAINS = [
  'producthunt.com', 'reddit.com', 'twitter.com', 'youtube.com',
  'medium.com', 'forbes.com', 'techcrunch.com', 'wired.com',
  'theverge.com', 'wikipedia.org', 'linkedin.com', 'facebook.com',
  'instagram.com', 'tiktok.com', 'amazon.com', 'ebay.com',
  'g2.com', 'capterra.com', 'trustpilot.com', 'yelp.com',
  'futurepedia.io', 'theresanaiforthat.com', 'toolify.ai',
  'alternativeto.net', 'slashdot.org', 'hackernews.com',
  'news.ycombinator.com', 'arstechnica.com', 'cnet.com',
  'zdnet.com', 'venturebeat.com', 'mashable.com',
];

// Title words that indicate articles, not tools
const TITLE_BANLIST = [
  'best', 'top', 'list', 'vs', 'review', 'tested', 'why', 'how ',
  'need in', 'alternatives', 'compared', 'guide', 'roundup',
  'picks', '10 ', '15 ', '20 ', '50 ', 'ways to',
  'article', 'blog', 'news', 'update', 'report',
];

const MAX_TOOLS_PER_RUN = 30;
const CATEGORIES_PER_RUN = 5;
const QUERIES_PER_CATEGORY = 3;

// ────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function isBlockedDomain(url: string): boolean {
  return BLOCKED_DOMAINS.some((d) => url.includes(d));
}

function isBannedTitle(title: string): boolean {
  const lower = title.toLowerCase();
  return TITLE_BANLIST.some((word) => lower.includes(word));
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function fuzzyMatch(a: string, b: string): boolean {
  const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalise(a) === normalise(b);
}

function inferCategory(content: string): string {
  const c = content.toLowerCase();
  if (c.includes('code') || c.includes('developer') || c.includes('programming') || c.includes('github') || c.includes('ide')) return 'Coding & Web Development';
  if (c.includes('writ') || c.includes('content') || c.includes('blog') || c.includes('copywriting')) return 'Writing & Content Creation';
  if (c.includes('image') || c.includes('art') || c.includes('design') || c.includes('graphic') || c.includes('illustration')) return 'Image Generation';
  if (c.includes('video') || c.includes('film') || c.includes('animation')) return 'Video Generation';
  if (c.includes('audio') || c.includes('music') || c.includes('voice') || c.includes('speech') || c.includes('podcast')) return 'Audio & Music';
  if (c.includes('data') || c.includes('research') || c.includes('analy') || c.includes('insight')) return 'Data Analysis & Research';
  if (c.includes('marketing') || c.includes('seo') || c.includes('advertis') || c.includes('social media')) return 'Marketing & SEO';
  if (c.includes('email') || c.includes('outreach') || c.includes('newsletter')) return 'Email & Outreach';
  if (c.includes('customer') || c.includes('support') || c.includes('chatbot') || c.includes('helpdesk')) return 'Customer Support';
  if (c.includes('education') || c.includes('learning') || c.includes('teach') || c.includes('course')) return 'Education & Learning';
  if (c.includes('finance') || c.includes('accounting') || c.includes('invest') || c.includes('trading')) return 'Finance & Accounting';
  if (c.includes('health') || c.includes('medical') || c.includes('wellness')) return 'Healthcare & Wellness';
  if (c.includes('legal') || c.includes('contract') || c.includes('compliance')) return 'Legal';
  if (c.includes('hr') || c.includes('hiring') || c.includes('recruit') || c.includes('resume')) return 'HR & Recruiting';
  if (c.includes('present') || c.includes('slide') || c.includes('pitch')) return 'Presentations';
  if (c.includes('translat') || c.includes('language')) return 'Translation';
  if (c.includes('no-code') || c.includes('low-code') || c.includes('drag and drop')) return 'No-Code / Low-Code';
  if (c.includes('automat') || c.includes('workflow') || c.includes('integrat')) return 'Productivity & Automation';
  if (c.includes('3d') || c.includes('modeling') || c.includes('render')) return '3D & Modeling';
  if (c.includes('spreadsheet') || c.includes('excel') || c.includes('csv')) return 'Spreadsheets & Data';
  if (c.includes('summar') || c.includes('digest') || c.includes('tldr')) return 'Summarization';
  return 'Productivity & Automation';
}

function inferPricing(content: string): string {
  const c = content.toLowerCase();
  if (c.includes('open source') || c.includes('open-source') || c.includes('free forever') || c.includes('completely free')) return 'Free';
  if (c.includes('enterprise') || c.includes('custom pricing') || c.includes('contact sales')) return 'Enterprise';
  if (c.includes('free plan') || c.includes('free tier') || c.includes('freemium') || c.includes('free trial')) return 'Freemium';
  if (c.includes('subscription') || c.includes('/month') || c.includes('/year') || c.includes('pro plan')) return 'Paid';
  return 'Freemium';
}

function inferPlatform(content: string): string {
  const c = content.toLowerCase();
  const platforms: string[] = [];
  if (c.includes('web app') || c.includes('browser') || c.includes('online tool') || c.includes('saas')) platforms.push('Web app');
  if (c.includes('desktop') || c.includes('windows') || c.includes('macos') || c.includes('mac app')) platforms.push('Desktop');
  if (c.includes('mobile') || c.includes('ios') || c.includes('android') || c.includes('phone')) platforms.push('Mobile');
  if (c.includes('api') || c.includes('sdk') || c.includes('developer') || c.includes('integration')) platforms.push('API');
  if (c.includes('extension') || c.includes('chrome') || c.includes('plugin')) platforms.push('Browser Extension');
  return platforms.length > 0 ? platforms.join(', ') : 'Web app';
}

function inferSkillLevel(content: string): string {
  const c = content.toLowerCase();
  if (c.includes('beginner') || c.includes('no-code') || c.includes('easy') || c.includes('simple') || c.includes('drag and drop')) return 'Beginner / No-Code';
  if (c.includes('advanced') || c.includes('developer') || c.includes('api') || c.includes('programming')) return 'Advanced / Developer';
  return 'Intermediate';
}

function extractKeyFeatures(content: string): string[] {
  const features: string[] = [];
  // Look for common feature patterns in markdown/text
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.replace(/^[\s*•\-–—►▸▹]+/, '').trim();
    if (trimmed.length > 15 && trimmed.length < 120 && !trimmed.includes('http')) {
      // Looks like a feature bullet
      if (/^[A-Z]/.test(trimmed) && features.length < 8) {
        features.push(trimmed);
      }
    }
  }
  return features.slice(0, 6);
}

function extractPros(content: string): string[] {
  const c = content.toLowerCase();
  const pros: string[] = [];
  if (c.includes('free') || c.includes('no cost')) pros.push('Free tier available');
  if (c.includes('easy') || c.includes('intuitive') || c.includes('simple')) pros.push('Easy to use interface');
  if (c.includes('fast') || c.includes('quick') || c.includes('instant')) pros.push('Fast processing speed');
  if (c.includes('api') || c.includes('integration')) pros.push('API and integrations available');
  if (c.includes('template') || c.includes('preset')) pros.push('Ready-made templates');
  if (c.includes('collaborat') || c.includes('team')) pros.push('Team collaboration features');
  if (c.includes('custom') || c.includes('configur')) pros.push('Highly customizable');
  return pros.slice(0, 4);
}

function extractCons(content: string, pricing: string): string[] {
  const cons: string[] = [];
  if (pricing === 'Paid' || pricing === 'Enterprise') cons.push('No free tier available');
  if (pricing === 'Freemium') cons.push('Free tier has limitations');
  const c = content.toLowerCase();
  if (c.includes('learning curve') || c.includes('complex')) cons.push('May have a learning curve');
  if (!c.includes('api')) cons.push('Limited API access');
  if (!c.includes('mobile') && !c.includes('ios') && !c.includes('android')) cons.push('No mobile app');
  return cons.slice(0, 3);
}

// ────────────────────────────────────────────
// MAIN HANDLER
// ────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(JSON.stringify({ error: 'FIRECRAWL_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('MY_SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Step 1: Build search queries ──
    const selectedCategories = pickRandom(CATEGORIES, CATEGORIES_PER_RUN);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const allQueries: string[] = [];
    for (const cat of selectedCategories) {
      const templates = pickRandom(QUERY_TEMPLATES, QUERIES_PER_CATEGORY);
      for (const tpl of templates) {
        allQueries.push(
          tpl
            .replace('{category}', cat)
            .replace('{year}', String(currentYear))
            .replace('{month}', currentMonth)
        );
      }
    }

    console.log(`Running ${allQueries.length} search queries across ${selectedCategories.length} categories`);

    // ── Step 2: Search for tools via Firecrawl ──
    const allDiscovered: any[] = [];

    for (const query of allQueries) {
      try {
        const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            limit: 5,
            scrapeOptions: { formats: ['markdown'] },
          }),
        });

        const searchData = await searchRes.json();
        if (searchData.success && searchData.data) {
          allDiscovered.push(...searchData.data);
        }
      } catch (e) {
        console.error(`Search failed for "${query}":`, e);
      }
    }

    console.log(`Discovered ${allDiscovered.length} results from web search`);

    // ── Step 3: Get existing tools for dedup ──
    const { data: existingTools } = await supabase
      .from('ai_tools')
      .select('name, website_url');

    const existingNames = new Set((existingTools || []).map((t: any) => t.name?.toLowerCase().replace(/[^a-z0-9]/g, '')));
    const existingDomains = new Set(
      (existingTools || []).map((t: any) => {
        try { return new URL(t.website_url).hostname.replace('www.', ''); } catch { return ''; }
      }).filter(Boolean)
    );

    // ── Step 4: Extract and enrich tool data ──
    const newTools: any[] = [];

    for (const result of allDiscovered) {
      if (newTools.length >= MAX_TOOLS_PER_RUN) break;

      const url = result.url;
      const title = result.title || '';
      const markdown = result.markdown || '';

      // Skip blocked domains
      if (!url || isBlockedDomain(url)) continue;

      // Skip articles/listicles based on title
      if (isBannedTitle(title)) continue;

      // Extract tool name from title
      const toolName = title.split(' - ')[0].split(' | ')[0].split(':')[0].split('–')[0].trim();
      if (!toolName || toolName.length > 50 || toolName.length < 2) continue;

      // Fuzzy dedup by normalised name
      const normalisedName = toolName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (existingNames.has(normalisedName)) continue;

      // Domain-level dedup
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        if (existingDomains.has(domain)) continue;
        existingDomains.add(domain);
      } catch { continue; }

      const content = title + ' ' + markdown;
      const category = inferCategory(content);
      const pricing = inferPricing(content);
      const platform = inferPlatform(content);
      const skillLevel = inferSkillLevel(content);
      const keyFeatures = extractKeyFeatures(markdown);
      const pros = extractPros(content);
      const cons = extractCons(content, pricing);

      // Clean description
      const cleanText = markdown
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/[#*`_>-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const description = result.description || (cleanText.slice(0, 800) + (cleanText.length > 800 ? '...' : ''));
      const longDescription = cleanText.slice(0, 3000) + (cleanText.length > 3000 ? '...' : '');

      const slug = slugify(toolName);

      newTools.push({
        name: toolName,
        slug,
        description,
        long_description: longDescription,
        website_url: url,
        category,
        skill_level: skillLevel,
        pricing,
        platform,
        primary_use_case: category.split(' & ')[0].split(' / ')[0],
        tags: [category.toLowerCase(), pricing.toLowerCase()],
        featured: false,
        key_features: keyFeatures,
        pros,
        cons,
      });

      existingNames.add(normalisedName);
    }

    // ── Step 5: Insert new tools ──
    let inserted = 0;
    if (newTools.length > 0) {
      const { error } = await supabase.from('ai_tools').insert(newTools);
      if (error) {
        console.error('Insert error:', error);
        // Try inserting one by one to skip dupes
        for (const tool of newTools) {
          const { error: singleErr } = await supabase.from('ai_tools').insert(tool);
          if (!singleErr) inserted++;
          else console.error(`Failed to insert ${tool.name}:`, singleErr.message);
        }
      } else {
        inserted = newTools.length;
      }
    }

    // ── Step 6: Recalculate trending scores ──
    const { data: allTools } = await supabase
      .from('ai_tools')
      .select('id, click_count, quiz_match_count, comparison_count, created_at');

    if (allTools) {
      const now = Date.now();
      for (const tool of allTools) {
        const ageMs = now - new Date(tool.created_at).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        const newnessFactor = Math.max(0, 100 - ageDays);

        const trendScore =
          (tool.click_count || 0) * 0.4 +
          (tool.quiz_match_count || 0) * 0.3 +
          (tool.comparison_count || 0) * 0.2 +
          newnessFactor * 0.1;

        await supabase
          .from('ai_tools')
          .update({ trend_score: Math.round(trendScore * 100) / 100 })
          .eq('id', tool.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      queries_run: allQueries.length,
      discovered: allDiscovered.length,
      inserted,
      trending_updated: allTools?.length || 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
