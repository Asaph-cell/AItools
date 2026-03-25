import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ToolGrid from "@/components/ToolGrid";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import { AiTool } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NewTools() {
  const { data: tools = [], isLoading } = useTools();
  const [compareList, setCompareList] = useState<AiTool[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  const navigate = useNavigate();

  const now = new Date();
  const cutoff = new Date(now);
  if (timeRange === "week") cutoff.setDate(cutoff.getDate() - 7);
  else cutoff.setDate(cutoff.getDate() - 30);

  const newTools = tools
    .filter((t) => new Date(t.created_at) >= cutoff)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
        title="New AI Tools — Recently Added Discoveries"
        description="Stay ahead of the curve with the latest AI tools added to our directory this week and month."
        canonical="https://findaitools.online/new"
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                New AI Tools This {timeRange === "week" ? "Week" : "Month"}
              </h1>
              <p className="text-muted-foreground">{newTools.length} tools added recently</p>
            </div>
          </div>
          {compareList.length >= 2 && (
            <Button onClick={() => navigate(`/compare?ids=${compareList.map(t => t.id).join(",")}`)}>
              Compare ({compareList.length})
            </Button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("week")}
          >
            This Week
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            This Month
          </Button>
        </div>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading tools...</p>
        ) : newTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No new tools added this {timeRange}.</p>
            <Button variant="outline" size="sm" onClick={() => setTimeRange("month")}>
              Try This Month
            </Button>
          </div>
        ) : (
          <ToolGrid tools={newTools} onCompare={handleCompare} compareList={compareList} />
        )}

        <div className="mt-12">        </div>
      </div>

      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground mt-12">
        <p>© {new Date().getFullYear()} Find AI Tools. All rights reserved.</p>
      </footer>
    </div>
  );
}
