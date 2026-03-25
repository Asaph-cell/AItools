import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import ToolCard from "@/components/ToolCard";
import { useTools } from "@/hooks/useTools";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlternativesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tools = [] } = useTools();

  const tool = useMemo(() => tools.find((t) => t.slug === slug), [tools, slug]);

  const alternatives = useMemo(() => {
    if (!tool) return [];
    return tools
      .filter((t) => t.category === tool.category && t.id !== tool.id)
      .sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0))
      .slice(0, 12);
  }, [tools, tool]);

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the tool you're looking for.</p>
          <Button asChild><Link to="/directory">Browse Directory</Link></Button>
        </div>
      </div>
    );
  }

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${alternatives.length} Best ${tool.name} Alternatives in ${year}`}
        description={`Looking for alternatives to ${tool.name}? Here are the ${alternatives.length} best ${tool.category} tools you should try in ${year}.`}
        canonical={`https://findaitools.online/alternatives/${slug}`}
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Link to={`/tools/${tool.slug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to {tool.name}
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          {alternatives.length} Best {tool.name} Alternatives in {year}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          Looking for a {tool.category.toLowerCase()} tool like {tool.name} but want to explore your options? 
          Here are the best alternatives we've found, ranked by trending score and community feedback.
        </p>

        {alternatives.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.map((alt) => (
              <ToolCard key={alt.id} tool={alt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No alternatives found yet. Check back soon!</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/directory">Browse All Tools <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
