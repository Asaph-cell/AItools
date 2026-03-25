import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTools } from "@/hooks/useTools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import FAQ from "@/components/FAQ";
import { ExternalLink, ArrowLeft, Check, X, ShieldCheck, GitCompare } from "lucide-react";

export default function VsPage() {
  const { slug } = useParams<{ slug: string }>(); // e.g., "chatgpt-vs-claude"
  const { data: tools = [], isLoading } = useTools();

  // Parse the slugs from the URL
  const match = slug?.match(/^(.+)-vs-(.+)$/);
  const slugA = match?.[1];
  const slugB = match?.[2];

  const toolA = tools.find((t) => t.slug === slugA);
  const toolB = tools.find((t) => t.slug === slugB);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center text-muted-foreground">
          Loading comparison...
        </div>
      </div>
    );
  }

  if (!toolA || !toolB) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Comparison Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find one or both of these tools in our database.</p>
          <Button asChild variant="outline">
            <Link to="/directory">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const category = toolA.category === toolB.category ? toolA.category : "AI Tools";

  // Generate dynamic FAQ for this comparison
  const comparisonFaq = [
    {
      question: `Is ${toolA.name} better than ${toolB.name}?`,
      answer: `The answer depends on your specific needs. ${toolA.name} shines when it comes to ${toolA.primary_use_case}, whereas ${toolB.name} is often preferred for ${toolB.primary_use_case}. Based on our aggregate data, ${toolA.name} has a rating of ${toolA.rating || "N/A"} and ${toolB.name} has a rating of ${toolB.rating || "N/A"}.`
    },
    {
      question: `Which is cheaper: ${toolA.name} or ${toolB.name}?`,
      answer: `${toolA.name} uses a ${toolA.pricing} pricing model. Meanwhile, ${toolB.name} uses a ${toolB.pricing} pricing model.`
    },
    {
      question: `Can beginners use both ${toolA.name} and ${toolB.name}?`,
      answer: `${toolA.name} requires a ${toolA.skill_level} skill level, while ${toolB.name} targets a ${toolB.skill_level} audience. Choose the one that best matches your technical comfort level.`
    }
  ];

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <SEO 
        title={`${toolA.name} vs ${toolB.name} (2026): In-Depth Comparison`}
        description={`Deciding between ${toolA.name} and ${toolB.name}? Read our deep-dive comparison covering pricing, features, pros, and cons to see which ${category} tool is right for you.`}
        canonical={`https://findaitools.online/vs/${slug}`}
      />
      <Navbar />
      
      {/* ══════════════ HEADER ══════════════ */}
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          <Link to="/directory" className="hover:text-primary transition-colors">Directory</Link>
          <span>/</span>
          <Link to={`/best/${toolA.category.toLowerCase().split(' ')[0]}`} className="hover:text-primary transition-colors">{category}</Link>
          <span>/</span>
          <span className="text-foreground">Vs</span>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6 flex flex-col sm:block drop-shadow-sm">
            <span className="text-primary">{toolA.name}</span>
            <span className="mx-4 text-muted-foreground text-3xl font-light italic">vs</span>
            <span className="text-accent">{toolB.name}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Which {category} tool takes the crown in 2026? We compare features, pricing, and community feedback to help you decide.
          </p>
        </div>

        {/* ══════════════ HEAD-TO-HEAD CARDS ══════════════ */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 relative">
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-surface-border items-center justify-center z-20 shadow-xl">
            <span className="text-xs font-bold text-muted-foreground uppercase">VS</span>
          </div>

          {/* Tool A */}
          <div className="bg-card/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="flex flex-col items-center text-center relative z-10 mb-8">
              <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-4xl font-bold text-primary shadow-lg border border-white/5 mb-6">
                {toolA.logo_url ? <img src={toolA.logo_url} alt={toolA.name} className="w-full h-full rounded-2xl object-cover" /> : toolA.name.charAt(0)}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{toolA.name}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-white/5">{toolA.pricing}</Badge>
                {toolA.rating && (
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30">★ {toolA.rating}/5</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm line-clamp-3">{toolA.description}</p>
            </div>

            <Button size="lg" className="w-full font-bold shadow-lg shadow-primary/20 mb-4" asChild>
              <a href={toolA.affiliate_url || toolA.website_url} target="_blank" rel="noopener noreferrer">
                Try {toolA.name} <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground" asChild>
              <Link to={`/tools/${toolA.slug}`}>Read Full Review</Link>
            </Button>
          </div>

          {/* Tool B */}
          <div className="bg-card/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="flex flex-col items-center text-center relative z-10 mb-8">
              <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-4xl font-bold text-accent shadow-lg border border-white/5 mb-6">
                {toolB.logo_url ? <img src={toolB.logo_url} alt={toolB.name} className="w-full h-full rounded-2xl object-cover" /> : toolB.name.charAt(0)}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{toolB.name}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-white/5">{toolB.pricing}</Badge>
                {toolB.rating && (
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30">★ {toolB.rating}/5</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm line-clamp-3">{toolB.description}</p>
            </div>

            <Button size="lg" className="w-full font-bold shadow-lg shadow-accent/20 mb-4 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <a href={toolB.affiliate_url || toolB.website_url} target="_blank" rel="noopener noreferrer">
                Try {toolB.name} <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground" asChild>
              <Link to={`/tools/${toolB.slug}`}>Read Full Review</Link>
            </Button>
          </div>
        </div>
        {/* ══════════════ FEATURE COMPARISON ══════════════ */}
        <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 mb-16 overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Specs & Features</h2>
          </div>
          
          <div className="max-w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-muted-foreground font-medium w-1/4">Feature</th>
                  <th className="p-4 border-b border-white/10 font-bold text-primary w-3/8 text-lg">{toolA.name}</th>
                  <th className="p-4 border-b border-white/10 font-bold text-accent w-3/8 text-lg">{toolB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <tr>
                  <td className="p-4 text-muted-foreground font-medium">Pricing Model</td>
                  <td className="p-4 text-foreground">{toolA.pricing}</td>
                  <td className="p-4 text-foreground">{toolB.pricing}</td>
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground font-medium">Platform</td>
                  <td className="p-4 text-foreground">{toolA.platform}</td>
                  <td className="p-4 text-foreground">{toolB.platform}</td>
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground font-medium">Best For</td>
                  <td className="p-4 text-foreground">{toolA.primary_use_case}</td>
                  <td className="p-4 text-foreground">{toolB.primary_use_case}</td>
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground font-medium">Skill Required</td>
                  <td className="p-4 text-foreground">{toolA.skill_level}</td>
                  <td className="p-4 text-foreground">{toolB.skill_level}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════ PROS & CONS SHOWDOWN ══════════════ */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Tool A Pros/Cons */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-4 border-b border-white/10 pb-2">{toolA.name} Breakdown</h3>
            {toolA.pros && toolA.pros.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                <h4 className="font-bold flex items-center gap-2 text-emerald-500 mb-4">
                  <Check className="h-4 w-4" /> Pros
                </h4>
                <ul className="space-y-3">
                  {toolA.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 opacity-80" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {toolA.cons && toolA.cons.length > 0 && (
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6">
                <h4 className="font-bold flex items-center gap-2 text-rose-500 mb-4">
                  <X className="h-4 w-4" /> Cons
                </h4>
                <ul className="space-y-3">
                  {toolA.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5 opacity-80" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tool B Pros/Cons */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-4 border-b border-white/10 pb-2">{toolB.name} Breakdown</h3>
            {toolB.pros && toolB.pros.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                <h4 className="font-bold flex items-center gap-2 text-emerald-500 mb-4">
                  <Check className="h-4 w-4" /> Pros
                </h4>
                <ul className="space-y-3">
                  {toolB.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 opacity-80" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {toolB.cons && toolB.cons.length > 0 && (
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6">
                <h4 className="font-bold flex items-center gap-2 text-rose-500 mb-4">
                  <X className="h-4 w-4" /> Cons
                </h4>
                <ul className="space-y-3">
                  {toolB.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5 opacity-80" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════ TABLE VIEW LINK ══════════════ */}
        <div className="bg-card/30 border border-white/5 rounded-2xl p-8 mb-16 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">Want more details?</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
            View our grid comparison tool to see an exhaustive breakdown of every feature, or add a 3rd tool to the mix.
          </p>
          <Button variant="outline" className="border-white/10 hover:border-primary/50 hover:bg-primary/5" asChild>
            <Link to={`/compare?ids=${toolA.id},${toolB.id}`}>
              <GitCompare className="mr-2 h-4 w-4 text-primary" /> Open Detailed Matrix
            </Link>
          </Button>
        </div>

        {/* ══════════════ FAQ ══════════════ */}
        <div className="mb-16">
          <FAQ items={comparisonFaq} title={`${toolA.name} vs ${toolB.name} FAQ`} />
        </div>

      </div>

      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground relative z-10">
        <p>© {new Date().getFullYear()} Find AI Tools. All rights reserved.</p>
      </footer>
    </div>
  );
}
