import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOOLS_PER_RUN = 5;

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

    // Find tools with sparse data (missing pros, cons, key_features, or short descriptions)
    const { data: sparseTools } = await supabase
      .from('ai_tools')
      .select('id, name, website_url, description, long_description, pros, cons, key_features, last_enriched_at')
      .or('pros.is.null,cons.is.null,key_features.is.null,long_description.is.null')
      .order('created_at', { ascending: false })
      .limit(TOOLS_PER_RUN);

    if (!sparseTools || sparseTools.length === 0) {
      return new Response(JSON.stringify({ success: true, enriched: 0, message: 'No tools need enrichment' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${sparseTools.length} tools to enrich`);
    let enriched = 0;

    for (const tool of sparseTools) {
      if (!tool.website_url) continue;

      try {
        // Scrape the tool's actual website for more info
        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: tool.website_url,
            formats: ['markdown'],
          }),
        });

        const scrapeData = await scrapeRes.json();
        if (!scrapeData.success || !scrapeData.data) {
          console.error(`Scrape failed for ${tool.name}`);
          continue;
        }

        const markdown = scrapeData.data.markdown || '';
        const content = markdown.toLowerCase();

        // Extract richer data
        const updates: any = {
          last_enriched_at: new Date().toISOString(),
        };

        // Long description
        if (!tool.long_description) {
          const cleanText = markdown
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/[#*`_>-]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          updates.long_description = cleanText.slice(0, 3000) + (cleanText.length > 3000 ? '...' : '');
        }

        // Key features
        if (!tool.key_features || tool.key_features.length === 0) {
          const features: string[] = [];
          const lines = markdown.split('\n');
          for (const line of lines) {
            const trimmed = line.replace(/^[\s*•\-–—►▸▹]+/, '').trim();
            if (trimmed.length > 15 && trimmed.length < 120 && !trimmed.includes('http') && /^[A-Z]/.test(trimmed)) {
              features.push(trimmed);
            }
          }
          if (features.length > 0) {
            updates.key_features = features.slice(0, 8);
          }
        }

        // Pros
        if (!tool.pros || tool.pros.length === 0) {
          const pros: string[] = [];
          if (content.includes('free')) pros.push('Free tier available');
          if (content.includes('easy') || content.includes('intuitive')) pros.push('Easy to use interface');
          if (content.includes('fast') || content.includes('quick')) pros.push('Fast processing speed');
          if (content.includes('api') || content.includes('integration')) pros.push('API and integrations');
          if (content.includes('template')) pros.push('Ready-made templates');
          if (content.includes('collaborat') || content.includes('team')) pros.push('Team collaboration');
          if (content.includes('custom')) pros.push('Highly customizable');
          if (content.includes('secur') || content.includes('encrypt')) pros.push('Strong security features');
          if (pros.length > 0) updates.pros = pros.slice(0, 5);
        }

        // Cons
        if (!tool.cons || tool.cons.length === 0) {
          const cons: string[] = [];
          if (!content.includes('free')) cons.push('No free tier');
          if (content.includes('learning curve')) cons.push('Steep learning curve');
          if (!content.includes('mobile') && !content.includes('ios')) cons.push('No mobile app');
          if (!content.includes('api')) cons.push('Limited API access');
          if (content.includes('beta') || content.includes('early access')) cons.push('Still in beta');
          if (cons.length > 0) updates.cons = cons.slice(0, 4);
        }

        // Pricing details
        const pricingDetails: any = {};
        if (content.includes('free plan') || content.includes('free tier')) pricingDetails.has_free_plan = true;
        const priceMatches = markdown.match(/\$(\d+(?:\.\d{2})?)\s*\/?\s*(mo|month|yr|year)/gi);
        if (priceMatches) {
          pricingDetails.price_mentions = priceMatches.slice(0, 5);
        }
        if (Object.keys(pricingDetails).length > 0) {
          updates.pricing_details = pricingDetails;
        }

        // Update the tool
        const { error: updateErr } = await supabase
          .from('ai_tools')
          .update(updates)
          .eq('id', tool.id);

        if (updateErr) {
          console.error(`Update failed for ${tool.name}:`, updateErr);
        } else {
          enriched++;
          console.log(`Enriched: ${tool.name}`);
        }
      } catch (e) {
        console.error(`Error enriching ${tool.name}:`, e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      found: sparseTools.length,
      enriched,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Enrich error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
