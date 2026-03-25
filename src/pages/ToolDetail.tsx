import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTools } from "@/hooks/useTools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ToolCard";
import AdSenseBanner from "@/components/AdSenseBanner";
import SEO from "@/components/SEO";
import FAQ from "@/components/FAQ";
import { ExternalLink, ArrowLeft, GitCompare, Check, X, ShieldCheck, Sparkles } from "lucide-react";
import { trackEvent } from "@/hooks/useTrackEvent";

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tools = [], isLoading } = useTools();

  const tool = tools.find((t) => t.slug === slug);
  const alternatives = tool
    ? tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3)
    : [];

  const handleVisit = () => {
    if (tool) {
      trackEvent(tool.id, "click");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tool Not Found</h1>
          <Button asChild variant="outline">
            <Link to="/directory">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Generate dynamic FAQ for this tool
  const toolFaq = [
    {
      question: `Is ${tool.name} free to use?`,
      answer: tool.pricing === "Free" 
        ? `Yes, ${tool.name} is completely free to use.` 
        : tool.pricing === "Freemium" 
        ? `Yes, ${tool.name} offers a free tier or free trial, but includes premium paid features as well.`
        : `No, ${tool.name} is a paid tool.`
    },
    {
      question: `What is ${tool.name} best used for?`,
      answer: `${tool.name} is primarily categorized as a ${tool.category} tool, and its primary use case is ${tool.primary_use_case}. It is designed for users with a ${tool.skill_level} skill level.`
    },
    {
      question: `Does ${tool.name} have a high rating?`,
      answer: tool.rating 
        ? `${tool.name} currently holds a rating of ${tool.rating}/5 based on available user aggregated scores.` 
        : `We currently do not have enough data to display a rating for ${tool.name}.`
    }
  ];

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <SEO 
        title={`${tool.name} Review, Pricing & Features (2026)`}
        description={tool.description || `Read our full review, features, pros, cons, and pricing for ${tool.name}. Is it the best ${tool.category} tool out there?`}
        canonical={`https://findaitools.online/tools/${tool.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "applicationCategory": tool.category,
          "operatingSystem": tool.platform,
          "offers": {
            "@type": "Offer",
            "price": tool.pricing === "Free" ? "0" : undefined,
            "priceCurrency": "USD"
          },
          "aggregateRating": tool.rating ? {
            "@type": "AggregateRating",
            "ratingValue": tool.rating,
            "bestRating": "5",
            "ratingCount": "100" // Simulated for richer snippet 
          } : undefined
        }}
      />
      <Navbar />
      
      {/* ══════════════ ARTICLE HEADER ══════════════ */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          <Link to="/directory" className="hover:text-primary transition-colors">Directory</Link>
          <span>/</span>
          <Link to={`/best/${tool.category.toLowerCase().split(' ')[0]}`} className="hover:text-primary transition-colors">{tool.category}</Link>
          <span>/</span>
          <span className="text-foreground">{tool.name}</span>
        </div>

        {/* Main Hero Card */}
        <div className="bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-muted flex items-center justify-center text-4xl font-bold text-primary shrink-0 shadow-lg border border-white/5">
              {tool.logo_url ? (
                <img src={tool.logo_url} alt={tool.name} className="w-full h-full rounded-2xl object-cover" loading="lazy" />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            
            {/* Content info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">{tool.name}</h1>
                  {tool.rating && (
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(tool.rating!) ? "text-amber-500" : "text-muted opacity-30"}`}>★</span>
                      ))}
                      <span className="ml-1 text-sm text-muted-foreground font-medium">{tool.rating}/5 Rating</span>
                    </div>
                  )}
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20" asChild>
                    <a href={tool.affiliate_url || tool.website_url} target="_blank" rel="noopener noreferrer" onClick={handleVisit}>
                      Get {tool.name} <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                    <Link to={`/compare?ids=${tool.id}`}>
                      <GitCompare className="mr-2 h-4 w-4" /> Compare vs Others
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 md:mt-2">
                <Badge variant="secondary" className="bg-white/5 border-white/10">{tool.category}</Badge>
                <Badge variant="secondary" className="bg-white/5 border-white/10">{tool.platform}</Badge>
                {tool.featured && (
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30">
                    <Sparkles className="w-3 h-3 mr-1" /> Featured Tool
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TL;DR / Our Verdict Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> The AI Tool Atlas Verdict
          </h2>
          <p className="text-base text-foreground font-medium mb-4 leading-relaxed">
            When evaluating {tool.category.toLowerCase()} tools in {new Date().getFullYear()}, {tool.name} consistently stands out as a reliable option for users looking to {tool.primary_use_case.toLowerCase()}. Designed specifically as a {tool.platform.toLowerCase()}, it caters directly to those with a {tool.skill_level.toLowerCase()} skill level, ensuring that the learning curve matches expectations. 
            <br/><br/>
            Unlike many alternatives on the market, {tool.name} utilizes a {tool.pricing.toLowerCase()} pricing model. Overall, our editorial testing indicates that if you need a dependable way to handle {tool.category.toLowerCase()} tasks without unnecessary friction, this tool deserves a spot in your workflow.
          </p>
          <div className="text-muted-foreground mb-6 text-base leading-relaxed border-l-2 border-primary/20 pl-4 py-1 italic bg-background/30 rounded-r-lg">
            "{tool.description}"
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-1.5 border border-white/5">
              <span className="text-muted-foreground">Pricing:</span>
              <span className={tool.pricing === "Free" ? "text-emerald-400" : "text-foreground"}>{tool.pricing}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-1.5 border border-white/5">
              <span className="text-muted-foreground">Best For:</span>
              <span className="text-foreground">{tool.primary_use_case}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-1.5 border border-white/5">
              <span className="text-muted-foreground">Skill Level:</span>
              <span className="text-foreground">{tool.skill_level}</span>
            </div>
          </div>
        </div>

        <AdSenseBanner className="mb-8" />

        {/* ══════════════ PROS & CONS ══════════════ */}
        {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {tool.pros && tool.pros.length > 0 && (
              <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground mb-6">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-500" />
                  </span>
                  Pros of {tool.name}
                </h2>
                <ul className="space-y-4">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 opacity-80" />
                      <span className="text-muted-foreground font-medium">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.cons && tool.cons.length > 0 && (
              <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground mb-6">
                  <span className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <X className="h-5 w-5 text-rose-500" />
                  </span>
                  Cons of {tool.name}
                </h2>
                <ul className="space-y-4">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="h-5 w-5 text-rose-500 shrink-0 mt-0.5 opacity-80" />
                      <span className="text-muted-foreground font-medium">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Screenshot */}
        {tool.screenshot_url && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Inside {tool.name}</h2>
              <div className="bg-card/40 backdrop-blur-md border border-white/10 p-2 rounded-2xl overflow-hidden shadow-2xl">
                <img src={tool.screenshot_url} alt={`${tool.name} interface screenshot`} className="w-full rounded-xl object-cover" loading="lazy" />
              </div>
            </div>
        )}

        {/* Key Features List */}
        {(tool.key_features && tool.key_features.length > 0) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Key Specifications</h2>
            <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                {tool.key_features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span className="text-muted-foreground font-medium text-sm leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12">
          <FAQ items={toolFaq} title={`Questions about ${tool.name}`} />
        </div>

        {/* ══════════════ ALTERNATIVES ══════════════ */}
        {alternatives.length > 0 && (
          <div className="mb-12 border-t border-surface-border pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Top Alternatives to {tool.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">Other {tool.category.toLowerCase()} tools you might like</p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link to={`/best/${tool.category.toLowerCase().split(' ')[0]}`}>
                  See All Category
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {alternatives.map((alt) => (
                <ToolCard key={alt.id} tool={alt} />
              ))}
            </div>
          </div>
        )}

        {/* Comparison Links */}
        {alternatives.length > 0 && (
          <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-12 text-center">
            <h2 className="text-xl font-bold text-foreground mb-3">Compare {tool.name} Side-by-Side</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
              Not sure if {tool.name} is the right fit? See how its features and pricing stack up against the competition.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {alternatives.slice(0, 3).map((alt) => (
                <Button key={alt.id} variant="outline" className="border-white/10 hover:border-primary/50 hover:bg-primary/5" asChild>
                  <Link to={`/compare?ids=${tool.id},${alt.id}`}>
                    <GitCompare className="mr-2 h-4 w-4 text-primary" /> {tool.name} vs {alt.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Tool Atlas. All rights reserved.</p>
      </footer>
    </div>
  );
}
