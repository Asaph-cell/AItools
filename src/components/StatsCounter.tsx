import { useEffect, useRef, useState } from "react";
import { Layers, FolderOpen, RefreshCw, DollarSign } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      {count}{suffix}
    </span>
  );
}

export default function StatsCounter({ toolCount, categoryCount }: { toolCount: number; categoryCount: number }) {
  const stats: StatItem[] = [
    { icon: Layers, value: toolCount || 100, suffix: "+", label: "AI Tools Reviewed" },
    { icon: FolderOpen, value: categoryCount || 8, suffix: "+", label: "Categories" },
    { icon: RefreshCw, value: 0, suffix: "", label: "Updated Weekly" },
    { icon: DollarSign, value: 100, suffix: "%", label: "Free to Use" },
  ];

  return (
    <section className="container max-w-6xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-3 border border-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            {stat.value > 0 ? (
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
            ) : (
              <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">✓</span>
            )}
            <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
