import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EditorsPick from "@/components/EditorsPick";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import { AiTool } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Scale, Search, ShieldCheck } from "lucide-react";

const BEST_OF_CONFIGS: Record<string, {
  title: string;
  description: string;
  intro: string;
  filter: (tools: AiTool[]) => AiTool[];
}> = {
  "coding": {
    title: "The Best AI Coding Tools in 2026",
    description: "Top-rated AI coding assistants, IDEs, and developer tools to supercharge your workflow.",
    intro: "The landscape of AI coding tools is moving fast. Whether you're a seasoned senior developer or just starting out, using the right AI assistant can easily 10x your productivity. We've tested the top contenders—from full IDEs like Cursor to lightweight autocomplete extensions—to bring you the definitive ranking of the best AI coding tools available today.",
    filter: (tools) => tools.filter(t => t.category === "Coding & Web Development").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "writing": {
    title: "The Best AI Writing Generators",
    description: "Discover the best AI writing assistants for blog posts, marketing copy, and content creation.",
    intro: "Staring at a blank page is a thing of the past. Today's AI writing tools can help you outline, draft, and polish everything from an email to a full-length book. But with so many options, which one offers the best voice, the least plagiarism risk, and the best value? Here is our ranking of the top AI writing assistants.",
    filter: (tools) => tools.filter(t => t.category === "Writing & Content Creation").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "research": {
    title: "Best AI Data & Research Tools",
    description: "AI-powered research assistants for data analysis, academic work, and deep dives.",
    intro: "Sifting through PDFs, analyzing datasets, and summarizing long reports can take hours. AI research tools are designed to ingest massive amounts of information and give you exactly the answers you need, complete with citations. Here are the most reliable AI tools for researchers, students, and analysts.",
    filter: (tools) => tools.filter(t => t.category === "Data Analysis & Research").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "free": {
    title: "The Best Totally Free AI Tools",
    description: "The top free AI tools you can start using today — no credit card required.",
    intro: "You don't need a massive budget to harness the power of artificial intelligence. Many of the most powerful LLMs and generators offer generous free tiers. We've compiled the absolute best AI tools you can use right now without paying a dime.",
    filter: (tools) => tools.filter(t => t.pricing === "Free").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "image-generation": {
    title: "Best AI Image Generators",
    description: "Create stunning AI art and images with these top generators.",
    intro: "From photorealistic portraits to stylized digital art, AI image generators have reached incredible levels of fidelity. But they aren't all created equal. Some excel at text rendering, while others are better at imaginative art. Here is our ranking of the top AI image generators for your next project.",
    filter: (tools) => tools.filter(t => t.category === "Image Generation").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "video": {
    title: "Best AI Video Generation Platforms",
    description: "Top AI tools for video creation, editing, and generation.",
    intro: "AI video generation is the bleeding edge of generative technology. Whether you want to generate a video from scratch using a text prompt, or use AI to edit and polish your existing footage, these are the tools leading the charge right now.",
    filter: (tools) => tools.filter(t => t.category === "Video Generation").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "startups": {
    title: "Best AI Tools for Startups & Founders",
    description: "Affordable and powerful AI tools perfect for startup teams and founders.",
    intro: "When you're running a startup, you need to do more with less. AI tools can act as an extension of your team—handling customer support, generating marketing copy, and automating boring tasks. Here are the best AI tools that give startups a serious competitive advantage.",
    filter: (tools) => tools.filter(t => t.pricing === "Free" || t.pricing === "Freemium").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
  "beginners": {
    title: "Best AI Tools for Beginners (No Code)",
    description: "Easy-to-use AI tools that require zero technical experience.",
    intro: "Intimidated by prompts, APIs, and complex interfaces? You don't need to be a prompt engineer to get value out of AI. We've selected the most intuitive, user-friendly AI tools that anyone can pick up and start using in minutes.",
    filter: (tools) => tools.filter(t => t.skill_level === "Beginner / No-Code").sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  },
};

export default function BestOf() {
  const { category } = useParams<{ category: string }>();
  const { data: tools = [], isLoading } = useTools();
  const [compareList, setCompareList] = useState<AiTool[]>([]);
  const navigate = useNavigate();

  const config = BEST_OF_CONFIGS[category || ""];

  const filtered = useMemo(() => {
    return config ? config.filter(tools) : [];
  }, [config, tools]);

  if (!config) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">Browse our available lists:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(BEST_OF_CONFIGS).map(([key, cfg]) => (
              <Link
                key={key}
                to={`/best/${key}`}
                className="bg-card/60 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all hover:-translate-y-0.5"
              >
                <h3 className="font-semibold text-card-foreground mb-1">{cfg.title}</h3>
                <p className="text-sm text-muted-foreground">{cfg.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <SEO 
        title={config.title}
        description={config.description}
        canonical={`https://findaitools.online/best/${category}`}
      />
      <Navbar />
      
      {/* ══════════════ HEADER ARTICLe ══════════════ */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <Sparkles className="h-3 w-3 mr-1" /> Editor's Choice
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">{config.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-2 font-medium">
            {config.description}
          </p>
        </div>
        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {config.intro}
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-1"><Search className="h-4 w-4" /> Analyzed {filtered.length} tools</span>
            <span>•</span>
            <span className="flex items-center gap-1"><RefreshCw className="h-4 w-4" /> Updated Weekly</span>
          </div>
        </div>

        {/* ══════════════ LISTINGS ══════════════ */}
        <div className="space-y-8 mb-16">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading ranking...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No tools found for this list yet.</div>
          ) : (
            filtered.map((tool, index) => (
              <div key={tool.id} className="scroll-mt-20" id={`tool-${tool.slug}`}>
                <EditorsPick tool={tool} rank={index + 1} />
              </div>
            ))
          )}
        </div>

        {/* ══════════════ METHODOLOGY ══════════════ */}
        <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">How We Evaluate Tools</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Our rankings are not strictly pay-to-play. We use a comprehensive scoring system that evaluates AI tools on several key metrics:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground text-sm">Features & Capabilities</h4>
                <p className="text-xs text-muted-foreground mt-1">Does the tool actually do what it claims? We test core features against industry benchmarks.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground text-sm">Pricing & Value</h4>
                <p className="text-xs text-muted-foreground mt-1">Is it worth the money? We look for generous free tiers and reasonable paid plans.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground text-sm">User Experience</h4>
                <p className="text-xs text-muted-foreground mt-1">How intuitive is the interface? Even complex tools should be relatively easy to navigate.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground text-sm">Community Sentiment</h4>
                <p className="text-xs text-muted-foreground mt-1">We track user reviews, Reddit discussions, and overall community consensus.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Browse other lists */}
        <div className="border-t border-surface-border pt-12">
          <h2 className="text-lg font-bold text-foreground mb-4">Read More Rankings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(BEST_OF_CONFIGS)
              .filter(([key]) => key !== category)
              .map(([key, cfg]) => (
                <Link
                  key={key}
                  to={`/best/${key}`}
                  className="group flex flex-col bg-card/40 border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-colors"
                >
                  <span className="font-medium text-sm text-card-foreground group-hover:text-primary transition-colors">{cfg.title}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground mt-12 relative z-10">
        <p>© {new Date().getFullYear()} Find AI Tools. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Ensure RefreshCw is imported
import { RefreshCw } from "lucide-react";
