import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

    // Step 1: Search for new AI tools using Firecrawl
    const sources = [
      'new AI web app site:com',
      'AI productivity tool application',
      'AI code generation assistant app',
    ];

    const allDiscovered: any[] = [];

    for (const query of sources) {
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

    // Step 2: Get existing tools to avoid duplicates
    const { data: existingTools } = await supabase
      .from('ai_tools')
      .select('name, website_url');

    const existingNames = new Set((existingTools || []).map(t => t.name?.toLowerCase()));
    const existingUrls = new Set((existingTools || []).map(t => t.website_url?.toLowerCase()));

    // Step 3: Extract tool info from search results using simple heuristics
    const newTools: any[] = [];

    for (const result of allDiscovered) {
      const url = result.url;
      const title = result.title || '';
      const markdown = result.markdown || '';

      // Skip if it's a known directory or news site, not a tool itself
      if (
        !url || 
        url.includes('producthunt.com') || 
        url.includes('reddit.com') || 
        url.includes('twitter.com') ||
        url.includes('youtube.com') ||
        url.includes('medium.com') ||
        url.includes('forbes.com') ||
        url.includes('techcrunch.com') ||
        url.includes('wired.com')
      ) continue;

      // Simple extraction: use title as tool name candidate
      const toolName = title.split(' - ')[0].split(' | ')[0].split(':')[0].trim();
      if (!toolName || toolName.length > 50) continue;
      
      const lowercaseTitle = title.toLowerCase();
      // Aggressively ignore articles, listicles, and review videos
      if (
        lowercaseTitle.includes('best') || 
        lowercaseTitle.includes('top') || 
        lowercaseTitle.includes('list') || 
        lowercaseTitle.includes('vs') || 
        lowercaseTitle.includes('review') || 
        lowercaseTitle.includes('tested') ||
        lowercaseTitle.includes('why') ||
        lowercaseTitle.includes('how ') ||
        lowercaseTitle.includes('need in')
      ) continue;

      if (existingNames.has(toolName.toLowerCase())) continue;
      if (existingUrls.has(url.toLowerCase())) continue;

      // Determine category from content
      const content = (title + ' ' + markdown).toLowerCase();
      let category = 'Productivity & Automation';
      if (content.includes('code') || content.includes('developer') || content.includes('programming')) category = 'Coding & Web Development';
      else if (content.includes('writ') || content.includes('content') || content.includes('blog')) category = 'Writing & Content Creation';
      else if (content.includes('image') || content.includes('art') || content.includes('design')) category = 'Image Generation';
      else if (content.includes('video') || content.includes('film')) category = 'Video Generation';
      else if (content.includes('data') || content.includes('research') || content.includes('analy')) category = 'Data Analysis & Research';

      const slug = toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Strip markdown formatting and extra spaces for clean prose
      const cleanText = markdown
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // remove links but keep text
        .replace(/[#*`_>-]/g, '') // remove markdown formatting
        .replace(/\s+/g, ' ') // collapse whitespace
        .trim();
        
      const newDescription = result.description || (cleanText.slice(0, 800) + (cleanText.length > 800 ? '...' : ''));

      newTools.push({
        name: toolName,
        slug,
        description: newDescription,
        website_url: url,
        category,
        skill_level: 'Beginner / No-Code',
        pricing: 'Freemium',
        platform: 'Web app',
        primary_use_case: 'Automate tasks',
        tags: [category.toLowerCase()],
        featured: false,
      });

      existingNames.add(toolName.toLowerCase());
      if (newTools.length >= 10) break; // Limit per sync
    }

    // Step 4: Insert new tools
    let inserted = 0;
    if (newTools.length > 0) {
      const { error } = await supabase.from('ai_tools').insert(newTools);
      if (error) {
        console.error('Insert error:', error);
      } else {
        inserted = newTools.length;
      }
    }

    // Step 5: Recalculate trending scores for all tools
    const { data: allTools } = await supabase
      .from('ai_tools')
      .select('id, click_count, quiz_match_count, comparison_count, created_at');

    if (allTools) {
      const now = Date.now();
      for (const tool of allTools) {
        const ageMs = now - new Date(tool.created_at).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        const newnessFactor = Math.max(0, 100 - ageDays); // Higher for newer tools

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
