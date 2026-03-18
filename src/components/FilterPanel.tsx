import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface FilterPanelProps {
  filters: { category?: string; skill_level?: string; pricing?: string; platform?: string; search?: string };
  onChange: (filters: FilterPanelProps["filters"]) => void;
}

const categories = ["Coding & Web Development", "Data Analysis & Research", "Writing & Content Creation", "Image Generation", "Video Generation", "Productivity & Automation"];
const skillLevels = ["Beginner / No-Code", "Intermediate", "Advanced / Developer"];
const pricingOptions = ["Free", "Freemium", "Paid"];
const platforms = ["Web app", "Desktop app", "VS Code plugin", "API / Developer tool"];

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const update = (key: string, value: string | undefined) => {
    onChange({ ...filters, [key]: value });
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          className="pl-9"
          value={filters.search || ""}
          onChange={(e) => update("search", e.target.value || undefined)}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={filters.category || ""} onValueChange={(v) => update("category", v || undefined)}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.skill_level || ""} onValueChange={(v) => update("skill_level", v || undefined)}>
          <SelectTrigger><SelectValue placeholder="Skill Level" /></SelectTrigger>
          <SelectContent>
            {skillLevels.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.pricing || ""} onValueChange={(v) => update("pricing", v || undefined)}>
          <SelectTrigger><SelectValue placeholder="Pricing" /></SelectTrigger>
          <SelectContent>
            {pricingOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.platform || ""} onValueChange={(v) => update("platform", v || undefined)}>
          <SelectTrigger><SelectValue placeholder="Platform" /></SelectTrigger>
          <SelectContent>
            {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          <X className="h-3 w-3 mr-1" /> Clear filters
        </Button>
      )}
    </div>
  );
}
