import { AiTool } from "@/lib/supabaseClient";
import ToolCard from "./ToolCard";
import AdCard from "./AdCard";

interface ToolGridProps {
  tools: AiTool[];
  onCompare?: (tool: AiTool) => void;
  compareList?: AiTool[];
}

export default function ToolGrid({ tools, onCompare, compareList = [] }: ToolGridProps) {
  const items: (AiTool | "ad")[] = [];
  tools.forEach((tool, i) => {
    items.push(tool);
    if ((i + 1) % 4 === 0 && i < tools.length - 1) {
      items.push("ad");
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) =>
        item === "ad" ? (
          <AdCard key={`ad-${i}`} />
        ) : (
          <ToolCard
            key={item.id}
            tool={item}
            onCompare={onCompare}
            isComparing={compareList.some((t) => t.id === item.id)}
          />
        )
      )}
    </div>
  );
}
