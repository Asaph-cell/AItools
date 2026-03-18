import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ToolGrid from "@/components/ToolGrid";
import AdSenseBanner from "@/components/AdSenseBanner";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import { AiTool } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function Trending() {
  const { data: tools = [], isLoading } = useTools();
  const [compareList, setCompareList] = useState<AiTool[]>([]);
  const navigate = useNavigate();

  // Sort by trend_score descending
  const trending = [...tools].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0)).slice(0, 20);

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
        title="Trending AI Tools — Most Popular This Week"
        description="See which AI tools are currently trending based on user clicks, comparisons, and matchmaker results."
        canonical="https://aitoolatlas.com/trending"
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Trending AI Tools</h1>
              <p className="text-muted-foreground">The most popular AI tools right now</p>
            </div>
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
        ) : (
          <ToolGrid tools={trending} onCompare={handleCompare} compareList={compareList} />
        )}
      </div>

      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground mt-12">
        <p>© {new Date().getFullYear()} AI Tool Atlas. All rights reserved.</p>
      </footer>
    </div>
  );
}
