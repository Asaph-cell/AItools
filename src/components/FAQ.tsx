import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQ: FAQItem[] = [
  {
    question: "How does Find AI Tools find and rank tools?",
    answer:
      "We use a combination of automated scraping and manual curation to discover AI tools across the web. Each tool is evaluated on features, pricing, user reviews, and community sentiment. Our trend scores update weekly based on user clicks, comparisons, and quiz matches.",
  },
  {
    question: "Is Find AI Tools free to use?",
    answer:
      "Yes! Find AI Tools is 100% free. You can browse the directory, use our AI Matchmaker quiz, compare tools side-by-side, and read all our guides without any account or payment.",
  },
  {
    question: "How often is the tool database updated?",
    answer:
      "Our database syncs automatically every week, pulling in new tools, updated pricing, and fresh user data. We also manually review featured tools to ensure accuracy.",
  },
  {
    question: "What is the AI Matchmaker Quiz?",
    answer:
      "The AI Matchmaker is a short quiz that asks about your use case, skill level, budget, and preferred platform. It then uses our recommendation algorithm to surface the best-matching AI tools from our database.",
  },
  {
    question: "Can I suggest a tool to be listed?",
    answer:
      "Absolutely! If you know of an AI tool that isn't in our directory, reach out to us via the contact link in the footer. We review all submissions and add qualifying tools to the database.",
  },
  {
    question: "How do the 'Best Of' lists work?",
    answer:
      "Our 'Best Of' lists are curated rankings within specific categories or use cases. Tools are ranked by a composite score including user ratings, feature richness, pricing value, and community popularity.",
  },
];

export default function FAQ({ items = DEFAULT_FAQ, title }: { items?: FAQItem[]; title?: string }) {
  return (
    <section className="container max-w-4xl mx-auto px-4 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{title || "Frequently Asked Questions"}</h2>
      </div>
      <Accordion type="multiple" className="space-y-3">
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="bg-card/60 backdrop-blur-md border border-white/10 rounded-xl px-6 data-[state=open]:border-primary/20 transition-colors"
          >
            <AccordionTrigger className="text-left font-semibold text-card-foreground hover:text-primary transition-colors py-5 text-[15px]">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
