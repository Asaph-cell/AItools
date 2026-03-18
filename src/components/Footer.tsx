import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border py-8 bg-background relative z-10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>© {new Date().getFullYear()} AI Tool Atlas. All rights reserved.</p>
            <p className="mt-1 text-xs opacity-70">Discover the best AI tools in seconds.</p>
          </div>
          
          <div className="flex gap-4 sm:gap-6 text-sm font-medium">
            <Link to="/directory" className="text-muted-foreground hover:text-foreground transition-colors">Directory</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <a href="mailto:contact@findaitools.online" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
