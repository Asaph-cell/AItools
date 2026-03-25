import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border pt-16 pb-8 bg-card/30 relative z-10 mt-auto">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground mb-4">
              <Compass className="h-6 w-6 text-primary" />
              Find AI Tools
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Discover, compare, and choose the perfect AI tools for your workflow. Expert reviews, community ratings, and side-by-side comparisons.
            </p>
            <div className="flex gap-4">
              <a href="mailto:contact@findaitools.online" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Contact Us
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Top Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/best/coding" className="text-muted-foreground hover:text-primary transition-colors">AI Coding Assistants</Link></li>
              <li><Link to="/best/writing" className="text-muted-foreground hover:text-primary transition-colors">AI Writing Generators</Link></li>
              <li><Link to="/best/image-generation" className="text-muted-foreground hover:text-primary transition-colors">AI Image Generators</Link></li>
              <li><Link to="/best/video" className="text-muted-foreground hover:text-primary transition-colors">AI Video Tools</Link></li>
              <li><Link to="/best/research" className="text-muted-foreground hover:text-primary transition-colors">AI Data & Research</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/directory" className="text-muted-foreground hover:text-primary transition-colors">Full Tool Directory</Link></li>
              <li><Link to="/matchmaker" className="text-muted-foreground hover:text-primary transition-colors">AI Matchmaker Quiz</Link></li>
              <li><Link to="/compare" className="text-muted-foreground hover:text-primary transition-colors">Compare Tools</Link></li>
              <li><Link to="/trending" className="text-muted-foreground hover:text-primary transition-colors">Trending This Week</Link></li>
              <li><Link to="/new" className="text-muted-foreground hover:text-primary transition-colors">Recently Added</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog & Guides</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Find AI Tools. All rights reserved.</p>
          <p>
            <span className="opacity-70">Designed for builders, creators, and researchers.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
