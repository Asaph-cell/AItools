import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ToolGrid from "@/components/ToolGrid";
import AdSenseBanner from "@/components/AdSenseBanner";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import { AiTool } from "@/lib/supabaseClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BEST_OF_CONFIGS: Record<string, {
  title: string;
  description: string;
  filter: (tools: AiTool[]) => AiTool[];
}> = {
  "coding": {
    title: "Best AI Tools for Coding in 2026",
    description: "Top-rated AI coding assistants, IDEs, and developer tools to supercharge your workflow.",
    filter: (tools) => tools.filter(t => t.category === "Coding & Web Development").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "writing": {
    title: "Best AI Tools for Writing",
    description: "Discover the best AI writing assistants for blog posts, marketing copy, and content creation.",
    filter: (tools) => tools.filter(t => t.category === "Writing & Content Creation").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "research": {
    title: "Best AI Tools for Research",
    description: "AI-powered research assistants for data analysis, academic work, and deep dives.",
    filter: (tools) => tools.filter(t => t.category === "Data Analysis & Research").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "free": {
    title: "Best Free AI Tools",
    description: "The top free AI tools you can start using today — no credit card required.",
    filter: (tools) => tools.filter(t => t.pricing === "Free").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "image-generation": {
    title: "Best AI Image Generation Tools",
    description: "Create stunning AI art and images with these top generators.",
    filter: (tools) => tools.filter(t => t.category === "Image Generation").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "video": {
    title: "Best AI Video Tools",
    description: "Top AI tools for video creation, editing, and generation.",
    filter: (tools) => tools.filter(t => t.category === "Video Generation").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "startups": {
    title: "Best AI Tools for Startups",
    description: "Affordable and powerful AI tools perfect for startup teams and founders.",
    filter: (tools) => tools.filter(t => t.pricing === "Free" || t.pricing === "Freemium").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "beginners": {
    title: "Best AI Tools for Beginners",
    description: "Easy-to-use AI tools that require zero technical experience.",
    filter: (tools) => tools.filter(t => t.skill_level === "Beginner / No-Code").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
};

export default function BestOf() {
  const { category } = useParams<{ category: string }>();
  const { data: tools = [], isLoading } = useTools();
  const [compareList, setCompareList] = useState<AiTool[]>([]);
  const navigate = useNavigate();

  const config = BEST_OF_CONFIGS[category || ""];

  if (!config) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">Browse our available lists:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(BEST_OF_CONFIGS).map(([key, cfg]) => (
              <Link
                key={key}
                to={`/best/${key}`}
                className="bg-card border border-surface-border rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-card-foreground mb-1">{cfg.title}</h3>
                <p className="text-sm text-muted-foreground">{cfg.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filtered = config.filter(tools);

  const handleCompare = (tool: AiTool) => {
    setCompareList((prev) => {
      if (prev.some((t) => t.id === tool.id)) return prev.filter((t) => t.id !== tool.id);
      if (prev.length >= 3) return prev;
      return [...prev, tool];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={config.title}
        description={config.description}
        canonical={`https://aitoolatlas.com/best/${category}`}
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{config.title}</h1>
            <p className="text-muted-foreground mt-1">{config.description}</p>
            <p className="text-sm text-muted-foreground mt-2">{filtered.length} tools</p>
          </div>
          {compareList.length >= 2 && (
            <Button onClick={() => navigate(`/compare?ids=${compareList.map(t => t.id).join(",")}`)}>
              Compare ({compareList.length})
            </Button>
          )}
        </div>

        <AdSenseBanner className="mb-6" />

        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading tools...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No tools found in this category yet.</p>
        ) : (
          <ToolGrid tools={filtered} onCompare={handleCompare} compareList={compareList} />
        )}

        {/* Browse other lists */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">Browse More Lists</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BEST_OF_CONFIGS)
              .filter(([key]) => key !== category)
              .map(([key, cfg]) => (
                <Button key={key} variant="outline" size="sm" asChild>
                  <Link to={`/best/${key}`}>{cfg.title}</Link>
                </Button>
              ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground mt-12">
        <p>© {new Date().getFullYear()} AI Tool Atlas. All rights reserved.</p>
      </footer>
    </div>
  );
}
