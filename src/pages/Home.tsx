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
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <SEO />
      <Navbar />

      {/* Banner Ad */}
      <div className="container max-w-6xl mx-auto px-4 pt-4">
        <AdSenseBanner />
      </div>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 py-16 md:py-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-6 flex flex-col sm:block drop-shadow-sm relative z-10">
          <span>Find the Perfect AI Tool</span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2 sm:mt-0 sm:ml-3">
            in 30 Seconds
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 px-2 sm:px-0 relative z-10">
          Discover the best AI tools for coding, research, writing, automation, and more. Stop guessing and start building faster.
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
      <section className="container max-w-6xl mx-auto px-4 pb-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Smart Matchmaker", desc: "Answer 5 quick questions and our algorithm finds your perfect tool." },
            { icon: Search, title: "Searchable Directory", desc: "Filter 100+ AI tools by pricing, specific use cases, and capabilities." },
            { icon: GitCompare, title: "Side-by-Side Comparison", desc: "Compare features and pricing of up to 3 tools instantly to make a choice." },
          ].map((f) => (
            <div key={f.title} className="bg-card/40 backdrop-blur-md border border-white/10 dark:border-white/5 hover:border-primary/30 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground mb-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
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
      <section className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Explore Top Categories</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "coding", label: "Best for Coding", emoji: "💻", gradient: "from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-500/20" },
            { key: "writing", label: "Best for Writing", emoji: "✍️", gradient: "from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border-emerald-500/20" },
            { key: "free", label: "Best Free Tools", emoji: "🆓", gradient: "from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-500/20" },
            { key: "research", label: "Best for Research", emoji: "🔬", gradient: "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/20" },
            { key: "image-generation", label: "Image Generation", emoji: "🎨", gradient: "from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20 border-rose-500/20" },
            { key: "video", label: "Video Generation", emoji: "🎬", gradient: "from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border-cyan-500/20" },
            { key: "startups", label: "Best for Startups", emoji: "🚀", gradient: "from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 border-violet-500/20" },
            { key: "beginners", label: "Best for Beginners", emoji: "🌱", gradient: "from-lime-500/10 to-green-500/10 hover:from-lime-500/20 hover:to-green-500/20 border-lime-500/20" },
          ].map((item) => (
            <Link
              key={item.key}
              to={`/best/${item.key}`}
              className={`bg-gradient-to-br ${item.gradient} border backdrop-blur-sm rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-4`}
            >
              <span className="text-3xl drop-shadow-sm">{item.emoji}</span>
              <span className="font-semibold text-card-foreground text-lg">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom AdSense */}
      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <AdSenseBanner />
      </div>

    </div>
  );
}
