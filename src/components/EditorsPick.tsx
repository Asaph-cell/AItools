import { Link } from "react-router-dom";
import { AiTool } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award, Star } from "lucide-react";
import { trackEvent } from "@/hooks/useTrackEvent";

export default function EditorsPick({ tool, rank }: { tool: AiTool; rank: number }) {
  return (
    <div className="group relative bg-card/70 backdrop-blur-md border border-white/10 hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 flex flex-col">
      {/* Rank & Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-sm font-bold shadow-lg">
            {rank}
          </span>
          {rank === 1 && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
              <Award className="h-3 w-3 mr-1" /> Editor's Choice
            </Badge>
          )}
        </div>
        {tool.rating && (
          <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star className="h-4 w-4 fill-amber-500" />
            {tool.rating}/5
          </div>
        )}
      </div>

      {/* Logo & Name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl font-bold text-primary shrink-0 border border-white/5">
          {tool.logo_url ? (
            <img src={tool.logo_url} alt={tool.name} className="w-full h-full rounded-xl object-cover" loading="lazy" />
          ) : (
            tool.name.charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <Link
            to={`/tools/${tool.slug}`}
            className="font-bold text-lg text-card-foreground block hover:text-primary transition-colors"
          >
            {tool.name}
          </Link>
          <p className="text-xs text-muted-foreground">{tool.category}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1 leading-relaxed">
        {tool.description}
      </p>

      {/* Pros snippet */}
      {tool.pros && tool.pros.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {tool.pros.slice(0, 2).map((pro, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{pro}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant="secondary" className="text-xs">{tool.platform}</Badge>
        <Badge className={`text-xs ${tool.pricing === "Free" ? "bg-accent text-accent-foreground" : ""}`}>
          {tool.pricing}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button size="sm" className="flex-1" asChild>
          <a
            href={tool.affiliate_url || tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(tool.id, "click")}
          >
            Try {tool.name} <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/tools/${tool.slug}`}>Details</Link>
        </Button>
      </div>
    </div>
  );
}
