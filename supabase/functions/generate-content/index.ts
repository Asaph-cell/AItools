import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('MY_SUPABASE_SERVICE_ROLE_KEY')!
    );

    const generated = { alternatives: 0, roundups: 0, digests: 0 };

    // ── 1. Generate "Alternatives to X" pages ──
    // For each tool, create an alternatives page listing tools in the same category
    const { data: allTools } = await supabase
      .from('ai_tools')
      .select('id, name, slug, category, description, pricing, rating, trend_score');

    if (allTools && allTools.length > 0) {
      // Group tools by category
      const byCategory: Record<string, typeof allTools> = {};
      for (const tool of allTools) {
        if (!byCategory[tool.category]) byCategory[tool.category] = [];
        byCategory[tool.category].push(tool);
      }

      // Generate alternatives pages for top tools (highest trend score)
      const topTools = [...allTools]
        .sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0))
        .slice(0, 50);  // Top 50 tools get alternatives pages

      for (const tool of topTools) {
        const altSlug = `alternatives-to-${tool.slug}`;

        // Check if already exists
        const { data: existing } = await supabase
          .from('auto_content')
          .select('id')
          .eq('slug', altSlug)
          .maybeSingle();

        if (existing) continue;

        const alternatives = (byCategory[tool.category] || [])
          .filter((t) => t.id !== tool.id)
          .sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0))
          .slice(0, 10);

        if (alternatives.length < 2) continue;

        const year = new Date().getFullYear();
        const title = `${alternatives.length} Best ${tool.name} Alternatives in ${year}`;
        const metaDesc = `Looking for alternatives to ${tool.name}? Here are the ${alternatives.length} best ${tool.category} tools you should try in ${year}.`;

        let content = `# ${title}\n\n`;
        content += `Looking for a ${tool.category.toLowerCase()} tool like ${tool.name} but want to explore your options? `;
        content += `Whether you need different pricing, more features, or a better fit for your workflow, these ${alternatives.length} alternatives are worth checking out.\n\n`;
        content += `## Why Look for ${tool.name} Alternatives?\n\n`;
        content += `While ${tool.name} is a popular choice for ${tool.category.toLowerCase()}, it may not be perfect for everyone. `;
        content += `Some users need different pricing models, specific integrations, or features that ${tool.name} doesn't offer. `;
        content += `Here are the best alternatives we've found:\n\n`;

        for (let i = 0; i < alternatives.length; i++) {
          const alt = alternatives[i];
          content += `### ${i + 1}. ${alt.name}\n\n`;
          content += `${alt.description || `A ${alt.category.toLowerCase()} tool that serves as a great alternative to ${tool.name}.`}\n\n`;
          content += `- **Pricing**: ${alt.pricing || 'Check website'}\n`;
          content += `- **Category**: ${alt.category}\n`;
          if (alt.rating) content += `- **Rating**: ${alt.rating}/5\n`;
          content += `\n[Learn more about ${alt.name}](/tools/${alt.slug})\n\n---\n\n`;
        }

        content += `## Conclusion\n\n`;
        content += `Each of these ${tool.name} alternatives brings something unique to the table. `;
        content += `We recommend trying out a few to see which one best fits your specific needs and workflow. `;
        content += `All of these tools are available in our [directory](/directory) for easy comparison.\n`;

        const { error } = await supabase.from('auto_content').insert({
          slug: altSlug,
          title,
          content,
          content_type: 'alternatives',
          category: tool.category,
          related_tool_ids: [tool.id, ...alternatives.map((a) => a.id)],
          meta_description: metaDesc,
        });

        if (!error) generated.alternatives++;
      }

      // ── 2. Generate category roundup content ──
      for (const [category, tools] of Object.entries(byCategory)) {
        if (tools.length < 3) continue;

        const catSlug = `best-${slugify(category)}-tools-${new Date().getFullYear()}`;

        const { data: existing } = await supabase
          .from('auto_content')
          .select('id')
          .eq('slug', catSlug)
          .maybeSingle();

        if (existing) continue;

        const sorted = [...tools].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0));
        const year = new Date().getFullYear();
        const title = `${sorted.length} Best ${category} AI Tools in ${year}`;
        const metaDesc = `Discover the ${sorted.length} best AI tools for ${category.toLowerCase()} in ${year}. Compare features, pricing, and find the perfect tool for your needs.`;

        let content = `# ${title}\n\n`;
        content += `Choosing the right AI tool for ${category.toLowerCase()} can be overwhelming with so many options available. `;
        content += `We've tested and reviewed ${sorted.length} tools to help you find the best fit.\n\n`;

        for (let i = 0; i < sorted.length; i++) {
          const t = sorted[i];
          content += `### ${i + 1}. ${t.name}\n\n`;
          content += `${t.description || `A powerful ${category.toLowerCase()} tool.`}\n\n`;
          content += `- **Pricing**: ${t.pricing || 'Check website'}\n`;
          if (t.rating) content += `- **Rating**: ${t.rating}/5\n`;
          content += `\n[View full review →](/tools/${t.slug})\n\n---\n\n`;
        }

        content += `## How We Ranked These Tools\n\n`;
        content += `Our rankings are based on a combination of user engagement (clicks, comparisons, quiz matches), `;
        content += `features, pricing, and community feedback. We update these rankings regularly as new tools emerge.\n`;

        const { error } = await supabase.from('auto_content').insert({
          slug: catSlug,
          title,
          content,
          content_type: 'roundup',
          category,
          related_tool_ids: sorted.map((t) => t.id),
          meta_description: metaDesc,
        });

        if (!error) generated.roundups++;
      }

      // ── 3. Generate weekly digest ──
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newThisWeek = allTools
        .filter((t) => new Date(t.created_at || 0) >= oneWeekAgo)
        .sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0));

      if (newThisWeek.length >= 2) {
        const weekStr = new Date().toISOString().split('T')[0];
        const digestSlug = `weekly-ai-tools-digest-${weekStr}`;

        const { data: existing } = await supabase
          .from('auto_content')
          .select('id')
          .eq('slug', digestSlug)
          .maybeSingle();

        if (!existing) {
          const title = `Weekly AI Tools Digest — ${newThisWeek.length} New Tools Discovered`;
          const metaDesc = `This week we discovered ${newThisWeek.length} new AI tools. Here's our roundup of the most interesting additions.`;

          let content = `# ${title}\n\n`;
          content += `*Published: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}*\n\n`;
          content += `This week, our automated discovery engine found ${newThisWeek.length} new AI tools. Here are the highlights:\n\n`;

          for (const t of newThisWeek.slice(0, 15)) {
            content += `### ${t.name}\n\n`;
            content += `${t.description || 'A new AI tool.'}\n\n`;
            content += `**Category**: ${t.category} | **Pricing**: ${t.pricing || 'TBD'}\n\n`;
            content += `[Check it out →](/tools/${t.slug})\n\n---\n\n`;
          }

          const { error } = await supabase.from('auto_content').insert({
            slug: digestSlug,
            title,
            content,
            content_type: 'weekly-digest',
            related_tool_ids: newThisWeek.map((t) => t.id),
            meta_description: metaDesc,
          });

          if (!error) generated.digests++;
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      generated,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generate content error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
