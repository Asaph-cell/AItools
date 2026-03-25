import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useAutoContent } from "@/hooks/useAutoContent";
import { BookOpen, TrendingUp, Layers, Calendar } from "lucide-react";

const typeIcons: Record<string, typeof BookOpen> = {
  alternatives: Layers,
  roundup: TrendingUp,
  "weekly-digest": Calendar,
  "category-guide": BookOpen,
};

const typeLabels: Record<string, string> = {
  alternatives: "Alternatives",
  roundup: "Best Of",
  "weekly-digest": "Weekly Digest",
  "category-guide": "Guide",
};

export default function BlogIndex() {
  const { data: content = [], isLoading } = useAutoContent();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Tools Blog — Guides, Comparisons & Weekly Digests"
        description="Read our auto-generated guides, alternatives pages, category roundups, and weekly AI tool digests."
        canonical="https://findaitools.online/blog"
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Guides, comparisons, and weekly digests — all auto-generated and updated regularly.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No articles yet. Check back soon — content is generated automatically!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.map((item) => {
              const Icon = typeIcons[item.content_type] || BookOpen;
              const label = typeLabels[item.content_type] || item.content_type;

              return (
                <Link
                  key={item.id}
                  to={`/blog/${item.slug}`}
                  className="group bg-card/60 backdrop-blur-md border border-white/10 hover:border-primary/30 rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Icon className="h-3 w-3" />
                      {label}
                    </span>
                    {item.category && (
                      <span className="text-xs text-muted-foreground">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.meta_description || item.content.slice(0, 120) + "..."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
