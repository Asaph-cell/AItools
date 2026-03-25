import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-surface-border">
      <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-4 overflow-hidden">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-card-foreground shrink-0 whitespace-nowrap">
          <Compass className="h-5 w-5 text-primary shrink-0" />
          <span className="truncate">Find AI Tools</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/directory">Directory</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/best">Best Of</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/trending">Trending</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/new">New</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/compare">Compare</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/blog">Blog</Link>
          </Button>
          <div className="w-px h-4 bg-border mx-2" />
          <Button size="sm" asChild>
            <Link to="/matchmaker">Start Quiz</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <Button size="sm" asChild className="h-8 px-3 text-xs">
            <Link to="/matchmaker">Quiz</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[75vw] sm:w-[350px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-6">
                <Link to="/" className="flex items-center gap-2 font-bold">
                  <Compass className="h-5 w-5 text-primary" />
                  Find AI Tools
                </Link>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link to="/directory">Directory</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link to="/best">Best Of</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link to="/trending">Trending</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link to="/new">New</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link to="/compare">Compare</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-base" asChild>
                    <Link to="/blog">Blog</Link>
                  </Button>
                  <div className="h-px w-full bg-border my-2" />
                  <Button className="justify-start text-base" asChild>
                    <Link to="/matchmaker">Start AI Quiz</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
