import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizAnswers } from "@/utils/filterTools";
import { ChevronRight, ChevronLeft } from "lucide-react";

const questions = [
  {
    key: "category",
    title: "What do you need AI for?",
    options: [
      "Coding & Web Development",
      "Data Analysis & Research",
      "Writing & Content Creation",
      "Image Generation",
      "Video Generation",
      "Productivity & Automation",
    ],
  },
  {
    key: "skill_level",
    title: "What is your technical experience?",
    options: ["Beginner / No-Code", "Intermediate", "Advanced / Developer"],
  },
  {
    key: "pricing",
    title: "What is your budget?",
    options: ["100% Free", "Freemium / Free Trial", "Paid"],
  },
  {
    key: "primary_use_case",
    title: "What are you trying to do?",
    options: [
      "Build apps",
      "Analyze data",
      "Write blog posts",
      "Generate marketing content",
      "Create images",
      "Automate tasks",
    ],
  },
  {
    key: "platform",
    title: "Where do you want to use the tool?",
    options: ["Web app", "Desktop app", "VS Code plugin", "API / Developer tool"],
  },
];

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const selectOption = (value: string) => {
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 150);
    } else {
      onComplete(updated);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Progress value={progress} className="h-1.5 mb-8" />

      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground font-medium">
          Question {step + 1} of {questions.length}
        </p>
      </div>

      <h2 className="text-2xl font-bold text-card-foreground text-center mb-8">
        {current.title}
      </h2>

      <div className="space-y-3 animate-slide-in">
        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => selectOption(option)}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-150 hover:border-primary hover:bg-primary/5 ${
              answers[current.key as keyof QuizAnswers] === option
                ? "border-primary bg-primary/5"
                : "border-surface-border bg-card"
            }`}
          >
            <span className="font-medium text-card-foreground">{option}</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => setStep(step - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      )}
    </div>
  );
}
