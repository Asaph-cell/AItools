import { Link } from "react-router-dom";
import { AiTool } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, GitCompare } from "lucide-react";
import { trackEvent } from "@/hooks/useTrackEvent";

interface ToolCardProps {
  tool: AiTool;
  onCompare?: (tool: AiTool) => void;
  isComparing?: boolean;
}

export default function ToolCard({ tool, onCompare, isComparing }: ToolCardProps) {
  const pricingColor = tool.pricing === "Free" ? "bg-accent text-accent-foreground" : "";

  const handleVisit = () => {
    trackEvent(tool.id, "click");
  };

  return (
    <div className="group bg-card border border-surface-border rounded-lg p-5 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 animate-fade-in flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <Link to={`/tools/${tool.slug}`} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-primary shrink-0">
          {tool.name.charAt(0)}
        </Link>
        <div className="min-w-0">
          <Link to={`/tools/${tool.slug}`} className="font-semibold text-card-foreground truncate block hover:text-primary transition-colors">
            {tool.name}
          </Link>
          <p className="text-xs text-muted-foreground">{tool.category}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{tool.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant="secondary" className="text-xs">{tool.platform}</Badge>
        <Badge variant="secondary" className="text-xs">{tool.skill_level}</Badge>
        <Badge className={`text-xs ${pricingColor}`}>{tool.pricing}</Badge>
      </div>

      <div className="flex gap-2 mt-auto">
        <Button size="sm" className="flex-1" asChild>
          <a href={tool.affiliate_url || tool.website_url} target="_blank" rel="noopener noreferrer" onClick={handleVisit}>
            Visit <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
        {onCompare && (
          <Button
            size="sm"
            variant={isComparing ? "default" : "outline"}
            onClick={() => onCompare(tool)}
          >
            <GitCompare className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
