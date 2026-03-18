import { AiTool } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface ComparisonTableProps {
  tools: AiTool[];
  onRemove: (id: string) => void;
}

export default function ComparisonTable({ tools, onRemove }: ComparisonTableProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium mb-2">No tools selected for comparison</p>
        <p className="text-sm">Browse the directory and click the compare button on tools you want to compare.</p>
      </div>
    );
  }

  const rows = [
    { label: "Category", key: "category" as const },
    { label: "Pricing", key: "pricing" as const },
    { label: "Skill Level", key: "skill_level" as const },
    { label: "Platform", key: "platform" as const },
    { label: "Best For", key: "primary_use_case" as const },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-background z-10">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground border-b border-surface-border w-40">Feature</th>
            {tools.map((tool) => (
              <th key={tool.id} className="p-4 border-b border-surface-border min-w-[200px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xl font-bold text-primary">
                    {tool.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-card-foreground">{tool.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => onRemove(tool.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-surface-border">
              <td className="p-4 text-sm font-medium text-muted-foreground">{row.label}</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-sm text-center text-card-foreground">
                  {tool[row.key] || "—"}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-b border-surface-border">
            <td className="p-4 text-sm font-medium text-muted-foreground">Tags</td>
            {tools.map((tool) => (
              <td key={tool.id} className="p-4 text-sm text-center text-card-foreground">
                {tool.tags?.join(", ") || "—"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 text-sm font-medium text-muted-foreground">Website</td>
            {tools.map((tool) => (
              <td key={tool.id} className="p-4 text-center">
                <Button size="sm" variant="outline" asChild>
                  <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                    Visit <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
