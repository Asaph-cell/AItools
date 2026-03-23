import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ComparisonTable from "@/components/ComparisonTable";
import { useTools } from "@/hooks/useTools";
import { AiTool } from "@/lib/supabaseClient";
import AdSenseBanner from "@/components/AdSenseBanner";

export default function Compare() {
  const [searchParams] = useSearchParams();
  const { data: tools = [] } = useTools();
  const [compareTools, setCompareTools] = useState<AiTool[]>([]);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids && tools.length > 0) {
      const idList = ids.split(",");
      setCompareTools(tools.filter((t) => idList.includes(t.id)));
    }
  }, [searchParams, tools]);

  const handleRemove = (id: string) => {
    setCompareTools((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Compare AI Tools</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Compare up to 3 tools side by side
        </p>

        <div className="bg-card border border-surface-border rounded-lg mb-8">
          <ComparisonTable tools={compareTools} onRemove={handleRemove} />
        </div>

        <AdSenseBanner className="mb-8" />
      </div>
    </div>
  );
}
