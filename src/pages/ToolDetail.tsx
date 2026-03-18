import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTools } from "@/hooks/useTools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ToolCard";
import AdSenseBanner from "@/components/AdSenseBanner";
import SEO from "@/components/SEO";
import { ExternalLink, ArrowLeft, GitCompare } from "lucide-react";

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tools = [], isLoading } = useTools();

  const tool = tools.find((t) => t.slug === slug);
  const alternatives = tool
    ? tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 6)
    : [];

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

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${tool.name} — AI Tool Review & Details`}
        description={tool.description || `Read reviews, features, and pricing for ${tool.name}. Find the best AI tools on AI Tool Atlas.`}
        canonical={`https://aitoolatlas.com/tools/${tool.slug}`}
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
            "ratingCount": "1"
          } : undefined
        }}
      />
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/directory" className="hover:text-foreground transition-colors">Directory</Link>
          <span>/</span>
          <span className="text-foreground">{tool.name}</span>
        </div>

        {/* Header */}
        <div className="bg-card border border-surface-border rounded-lg p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-primary shrink-0">
              {tool.logo_url ? (
                <img src={tool.logo_url} alt={tool.name} className="w-full h-full rounded-xl object-cover" loading="lazy" />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-card-foreground mb-2">{tool.name}</h1>
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{tool.category}</Badge>
                <Badge variant="secondary">{tool.platform}</Badge>
                <Badge variant="secondary">{tool.skill_level}</Badge>
                <Badge className={tool.pricing === "Free" ? "bg-accent text-accent-foreground" : ""}>
                  {tool.pricing}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button asChild>
              <a href={tool.affiliate_url || tool.website_url} target="_blank" rel="noopener noreferrer">
                Visit {tool.name} <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/compare?ids=${tool.id}`}>
                <GitCompare className="mr-2 h-4 w-4" /> Compare
              </Link>
            </Button>
          </div>
        </div>

        {/* Ad */}
        <AdSenseBanner className="mb-6" />

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pricing & Info */}
          <div className="bg-card border border-surface-border rounded-lg p-6">
            <h2 className="font-semibold text-card-foreground mb-4">Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pricing</dt>
                <dd className="font-medium text-card-foreground">{tool.pricing}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Platform</dt>
                <dd className="font-medium text-card-foreground">{tool.platform}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Skill Level</dt>
                <dd className="font-medium text-card-foreground">{tool.skill_level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Best For</dt>
                <dd className="font-medium text-card-foreground">{tool.primary_use_case}</dd>
              </div>
              {tool.rating && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Rating</dt>
                  <dd className="font-medium text-card-foreground">⭐ {tool.rating}/5</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Key Features */}
          <div className="bg-card border border-surface-border rounded-lg p-6">
            <h2 className="font-semibold text-card-foreground mb-4">Key Features</h2>
            {(tool.key_features && tool.key_features.length > 0) ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tool.key_features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            ) : tool.tags && tool.tags.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tool.tags.map((tag, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No features listed yet.</p>
            )}
          </div>
        </div>

        {/* Pros & Cons */}
        {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {tool.pros && tool.pros.length > 0 && (
              <div className="bg-card border border-surface-border rounded-lg p-6">
                <h2 className="font-semibold text-accent mb-4">✅ Pros</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.cons && tool.cons.length > 0 && (
              <div className="bg-card border border-surface-border rounded-lg p-6">
                <h2 className="font-semibold text-destructive mb-4">⚠️ Cons</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Screenshot */}
        {tool.screenshot_url && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Screenshot</h2>
            <div className="bg-card border border-surface-border rounded-lg overflow-hidden">
              <img src={tool.screenshot_url} alt={`${tool.name} screenshot`} className="w-full" loading="lazy" />
            </div>
          </div>
        )}

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Alternatives to {tool.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alternatives.map((alt) => (
                <Link key={alt.id} to={`/tools/${alt.slug}`}>
                  <ToolCard tool={alt} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Links */}
        {alternatives.length > 0 && (
          <div className="bg-card border border-surface-border rounded-lg p-6">
            <h2 className="font-semibold text-card-foreground mb-4">Popular Comparisons</h2>
            <div className="flex flex-wrap gap-2">
              {alternatives.slice(0, 4).map((alt) => (
                <Button key={alt.id} variant="outline" size="sm" asChild>
                  <Link to={`/compare?ids=${tool.id},${alt.id}`}>
                    {tool.name} vs {alt.name}
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
