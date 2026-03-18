import { AiTool } from "@/lib/supabaseClient";

export type QuizAnswers = {
  category?: string;
  skill_level?: string;
  pricing?: string;
  primary_use_case?: string;
  platform?: string;
};

export function filterTools(tools: AiTool[], answers: QuizAnswers): AiTool[] {
  if (!answers || Object.keys(answers).length === 0) return tools;

  // Score each tool based on how many criteria match
  const scored = tools.map((tool) => {
    let score = 0;
    if (answers.category && tool.category === answers.category) score += 3;
    if (answers.skill_level && tool.skill_level === answers.skill_level) score += 2;
    if (answers.pricing) {
      if (answers.pricing === "100% Free" && tool.pricing === "Free") score += 2;
      else if (answers.pricing === "Freemium / Free Trial" && (tool.pricing === "Freemium" || tool.pricing === "Free")) score += 2;
      else if (answers.pricing === "Paid") score += 1; // all tools match paid budget
    }
    if (answers.primary_use_case && tool.primary_use_case === answers.primary_use_case) score += 2;
    if (answers.platform && tool.platform === answers.platform) score += 1;
    return { tool, score };
  });

  // Sort by score descending, return tools with score > 0, or all if none match
  scored.sort((a, b) => b.score - a.score);
  const matched = scored.filter((s) => s.score > 0).map((s) => s.tool);
  return matched.length > 0 ? matched : tools;
}

export function filterToolsByFilters(
  tools: AiTool[],
  filters: { category?: string; skill_level?: string; pricing?: string; platform?: string; search?: string }
): AiTool[] {
  return tools.filter((tool) => {
    if (filters.category && tool.category !== filters.category) return false;
    if (filters.skill_level && tool.skill_level !== filters.skill_level) return false;
    if (filters.pricing && tool.pricing !== filters.pricing) return false;
    if (filters.platform && tool.platform !== filters.platform) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description?.toLowerCase().includes(q) ||
        tool.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });
}
