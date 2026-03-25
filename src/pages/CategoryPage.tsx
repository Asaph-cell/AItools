import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import ToolCard from "@/components/ToolCard";
import { useTools } from "@/hooks/useTools";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function unslugify(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tools = [] } = useTools();

  const categoryName = unslugify(slug || "");

  const categoryTools = useMemo(() => {
    return tools
      .filter((t) => {
        const toolCatSlug = t.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return toolCatSlug === slug || t.category.toLowerCase().includes((slug || "").replace(/-/g, " "));
      })
      .sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0));
  }, [tools, slug]);

  const stats = useMemo(() => {
    const free = categoryTools.filter((t) => t.pricing === "Free" || t.pricing === "Freemium").length;
    const paid = categoryTools.filter((t) => t.pricing === "Paid" || t.pricing === "Enterprise").length;
    const avgRating = categoryTools.reduce((sum, t) => sum + (t.rating || 0), 0) / (categoryTools.length || 1);
    return { free, paid, total: categoryTools.length, avgRating: avgRating.toFixed(1) };
  }, [categoryTools]);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`Best ${categoryName} AI Tools in ${year} — ${stats.total} Tools Compared`}
        description={`Discover the ${stats.total} best AI tools for ${categoryName.toLowerCase()} in ${year}. Compare features, pricing, and find the perfect tool.`}
        canonical={`https://findaitools.online/category/${slug}`}
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Link to="/directory" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> All Categories
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
          Best {categoryName} AI Tools in {year}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          Browse and compare {stats.total} AI tools for {categoryName.toLowerCase()}, ranked by trending score and community feedback.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tools", value: stats.total },
            { label: "Free / Freemium", value: stats.free },
            { label: "Paid / Enterprise", value: stats.paid },
            { label: "Avg Rating", value: `${stats.avgRating}/5` },
          ].map((s) => (
            <div key={s.label} className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {categoryTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No tools found in this category yet.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/directory">Browse All Categories <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
