import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FilterPanel from "@/components/FilterPanel";
import ToolGrid from "@/components/ToolGrid";
import AdSenseBanner from "@/components/AdSenseBanner";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import { filterToolsByFilters } from "@/utils/filterTools";
import { AiTool } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function Directory() {
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [compareList, setCompareList] = useState<AiTool[]>([]);
  const { data: tools = [], isLoading } = useTools();
  const navigate = useNavigate();

  const filtered = filterToolsByFilters(tools, filters);

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
        title="AI Tool Directory — Browse 20+ Top AI Tools"
        description="Explore our comprehensive directory of AI tools categorized by use case. Filter by pricing, category, and platform to find exactly what you need."
        canonical="https://findaitools.online/directory"
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Tool Directory</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} tools</p>
          </div>
          {compareList.length >= 2 && (
            <Button
              onClick={() => {
                const ids = compareList.map((t) => t.id).join(",");
                navigate(`/compare?ids=${ids}`);
              }}
            >
              Compare ({compareList.length})
            </Button>
          )}
        </div>

        <div className="mb-6">
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>

        {/* Banner Ad */}
        <AdSenseBanner className="mb-6" />

        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading tools...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No tools match your filters.</p>
        ) : (
          <ToolGrid tools={filtered} onCompare={handleCompare} compareList={compareList} />
        )}

        <div className="mt-12">
          <AdSenseBanner />
        </div>
      </div>
    </div>
  );
}
