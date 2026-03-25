import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Quiz from "@/components/Quiz";
import ToolGrid from "@/components/ToolGrid";
import SEO from "@/components/SEO";
import { useTools } from "@/hooks/useTools";
import { filterTools, QuizAnswers } from "@/utils/filterTools";
import { Button } from "@/components/ui/button";
import { AiTool } from "@/lib/supabaseClient";
import { RotateCcw } from "lucide-react";

export default function Matchmaker() {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [compareList, setCompareList] = useState<AiTool[]>([]);
  const { data: tools = [], isLoading } = useTools();
  const navigate = useNavigate();

  const results = answers ? filterTools(tools, answers) : [];

  const handleCompare = (tool: AiTool) => {
    setCompareList((prev) => {
      if (prev.some((t) => t.id === tool.id)) return prev.filter((t) => t.id !== tool.id);
      if (prev.length >= 3) return prev;
      return [...prev, tool];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="AI Matchmaker — Find Your Perfect AI Tool"
        description="Answer a few quick questions and get personalized AI tool recommendations tailored to your specific needs and skill level."
        canonical="https://findaitools.online/matchmaker"
      />
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {!answers ? (
          <Quiz onComplete={setAnswers} />
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Your Recommended Tools</h1>
                <p className="text-muted-foreground">{results.length} tools matched your preferences</p>
              </div>
              <div className="flex gap-2">
                {compareList.length >= 2 && (
                  <Button
                    onClick={() => {
                      const ids = compareList.map((t) => t.id).join(",");
                      navigate(`/compare?ids=${ids}`);
                    }}
                  >
                    Compare ({compareList.length})
                  </Button>
                )}
                <Button variant="outline" onClick={() => { setAnswers(null); setCompareList([]); }}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Retake
                </Button>
              </div>
            </div>

            {/* Banner Ad */}
            {isLoading ? (
              <p className="text-muted-foreground text-center py-12">Loading tools...</p>
            ) : (
              <ToolGrid tools={results} onCompare={handleCompare} compareList={compareList} />
            )}

            {/* Bottom Banner Ad */}
            {answers && (
              <div className="mt-12">              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
