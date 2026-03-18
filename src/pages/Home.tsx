import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ToolCard from "@/components/ToolCard";
import AdSenseBanner from "@/components/AdSenseBanner";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import { ArrowRight, Search, Zap, GitCompare, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const { data: tools = [] } = useTools();

  const trending = [...tools].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0)).slice(0, 3);

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newTools = tools
    .filter((t) => new Date(t.created_at) >= weekAgo)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Navbar />

      {/* Banner Ad */}
      <div className="container max-w-6xl mx-auto px-4 pt-4">
        <AdSenseBanner />
      </div>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-4 flex flex-col sm:block">
          <span>Find the Perfect AI Tool</span>
          <span className="text-primary mt-1 sm:mt-0 sm:ml-2">in 30 Seconds</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 px-2 sm:px-0">
          Discover the best AI tools for coding, research, writing, automation, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link to="/matchmaker">
              Start the Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link to="/directory">Browse All AI Tools</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Smart Matchmaker", desc: "Answer 5 quick questions and get personalized AI tool recommendations." },
            { icon: Search, title: "Searchable Directory", desc: "Browse and filter 20+ AI tools by category, pricing, platform, and more." },
            { icon: GitCompare, title: "Side-by-Side Comparison", desc: "Compare up to 3 tools to find the best fit for your needs." },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-surface-border rounded-lg p-6 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      {trending.length > 0 && (
        <section className="container max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Trending AI Tools</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/trending">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* New This Week */}
      {newTools.length > 0 && (
        <section className="container max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground">New AI Tools This Week</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/new">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Best Of Lists */}
      <section className="container max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-foreground mb-6">Browse Best-Of Lists</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "coding", label: "Best for Coding", emoji: "💻" },
            { key: "writing", label: "Best for Writing", emoji: "✍️" },
            { key: "free", label: "Best Free Tools", emoji: "🆓" },
            { key: "research", label: "Best for Research", emoji: "🔬" },
            { key: "image-generation", label: "Best Image AI", emoji: "🎨" },
            { key: "video", label: "Best Video AI", emoji: "🎬" },
            { key: "startups", label: "Best for Startups", emoji: "🚀" },
            { key: "beginners", label: "Best for Beginners", emoji: "🌱" },
          ].map((item) => (
            <Link
              key={item.key}
              to={`/best/${item.key}`}
              className="bg-card border border-surface-border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="font-medium text-card-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Tool Atlas. All rights reserved.</p>
      </footer>
    </div>
  );
}
