import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ToolCard from "@/components/ToolCard";
import EditorsPick from "@/components/EditorsPick";
import StatsCounter from "@/components/StatsCounter";
import FAQ from "@/components/FAQ";
import AdSenseBanner from "@/components/AdSenseBanner";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import {
  ArrowRight,
  Search,
  Zap,
  GitCompare,
  TrendingUp,
  Sparkles,
  MousePointer,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { useMemo } from "react";

export default function Home() {
  const { data: tools = [] } = useTools();

  const trending = useMemo(
    () => [...tools].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0)).slice(0, 6),
    [tools]
  );

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newTools = useMemo(
    () =>
      tools
        .filter((t) => new Date(t.created_at) >= weekAgo)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6),
    [tools]
  );

  const editorsPicks = useMemo(
    () => tools.filter((t) => t.featured).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3),
    [tools]
  );

  const categoryCount = useMemo(
    () => new Set(tools.map((t) => t.category)).size,
    [tools]
  );

  // Auto-generate popular comparison pairings from top tools
  const popularComparisons = useMemo(() => {
    const top = [...tools].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0)).slice(0, 10);
    const pairs: { a: typeof top[0]; b: typeof top[0] }[] = [];
    for (let i = 0; i < top.length && pairs.length < 6; i++) {
      for (let j = i + 1; j < top.length && pairs.length < 6; j++) {
        if (top[i].category === top[j].category) {
          pairs.push({ a: top[i], b: top[j] });
        }
      }
    }
    // If not enough same-category pairs, fill with top pairs
    if (pairs.length < 4) {
      for (let i = 0; i < top.length && pairs.length < 6; i++) {
        for (let j = i + 1; j < top.length && pairs.length < 6; j++) {
          if (!pairs.some((p) => (p.a.id === top[i].id && p.b.id === top[j].id))) {
            pairs.push({ a: top[i], b: top[j] });
          }
        }
      }
    }
    return pairs;
  }, [tools]);

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <SEO />
      <Navbar />

      {/* Banner Ad */}
      <div className="container max-w-6xl mx-auto px-4 pt-4">
        <AdSenseBanner />
      </div>

      {/* ══════════════ HERO ══════════════ */}
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
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center relative z-10">
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

      {/* ══════════════ STATS COUNTER ══════════════ */}
      <StatsCounter toolCount={tools.length} categoryCount={categoryCount} />

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="container max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-foreground text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
          {[
            {
              icon: MousePointer,
              step: "1",
              title: "Browse or Take the Quiz",
              desc: "Explore our directory of 100+ AI tools or answer 5 quick questions to get personalized recommendations.",
            },
            {
              icon: SlidersHorizontal,
              step: "2",
              title: "Filter & Compare",
              desc: "Narrow results by category, pricing, platform, and skill level. Compare up to 3 tools side-by-side.",
            },
            {
              icon: CheckCircle2,
              step: "3",
              title: "Choose & Start Building",
              desc: "Pick the tool that fits your needs. Click through to try it out and start building faster today.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-6 shadow-lg border border-primary/10 relative z-10">
                <item.icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
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

      {/* ══════════════ EDITOR'S PICKS ══════════════ */}
      {editorsPicks.length > 0 && (
        <section className="container max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Editor's Picks</h2>
                <p className="text-sm text-muted-foreground">Our top-rated AI tools this month</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/directory">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {editorsPicks.map((tool, i) => (
              <EditorsPick key={tool.id} tool={tool} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Mid-page Ad */}
      <div className="container max-w-6xl mx-auto px-4 pb-8">
        <AdSenseBanner />
      </div>

      {/* ══════════════ TRENDING ══════════════ */}
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

      {/* ══════════════ NEW THIS WEEK ══════════════ */}
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

      {/* ══════════════ EXPLORE TOP CATEGORIES ══════════════ */}
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

      {/* ══════════════ POPULAR COMPARISONS ══════════════ */}
      {popularComparisons.length > 0 && (
        <section className="container max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                <GitCompare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Popular Comparisons</h2>
                <p className="text-sm text-muted-foreground">See how top AI tools stack up against each other</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/compare">Compare Tools <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularComparisons.map((pair) => (
              <Link
                key={`${pair.a.id}-${pair.b.id}`}
                to={`/vs/${pair.a.slug}-vs-${pair.b.slug}`}
                className="group bg-card/60 backdrop-blur-md border border-white/10 hover:border-primary/30 rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {pair.a.logo_url ? (
                      <img src={pair.a.logo_url} alt={pair.a.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      pair.a.name.charAt(0)
                    )}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">vs</span>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {pair.b.logo_url ? (
                      <img src={pair.b.logo_url} alt={pair.b.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      pair.b.name.charAt(0)
                    )}
                  </div>
                </div>
                <p className="mt-3 font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {pair.a.name} vs {pair.b.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pair.a.category}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ FAQ ══════════════ */}
      <FAQ />

      {/* Bottom AdSense */}
      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <AdSenseBanner />
      </div>
    </div>
  );
}
