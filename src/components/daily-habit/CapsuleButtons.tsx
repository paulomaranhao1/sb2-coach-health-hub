
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Sun, Moon } from "lucide-react";

interface CapsuleButtonsProps {
  type: "morning" | "evening";
}

const CapsuleButtons = ({ type }: CapsuleButtonsProps) => {
  const [capsuleTaken, setCapsuleTaken] = useState(false);

  const handleCapsuleClick = () => {
    setCapsuleTaken(!capsuleTaken);
  };

  const isMorning = type === "morning";
  const Icon = isMorning ? Sun : Moon;
  const colorClasses = isMorning 
    ? {
        taken: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
        notTaken: "border-2 border-orange-400 dark:border-orange-500 text-orange-700 dark:text-orange-300 hover:bg-orange-200/50 dark:hover:bg-orange-800/50 bg-white/70 dark:bg-orange-900/20",
        badge: "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-600"
      }
    : {
        taken: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
        notTaken: "border-2 border-purple-400 dark:border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 bg-white/70 dark:bg-purple-900/20",
        badge: "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600"
      };

  return (
    <>
      <Button
        onClick={handleCapsuleClick}
        variant={capsuleTaken ? "default" : "outline"}
        className={`w-full h-24 text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
          capsuleTaken 
            ? `${colorClasses.taken} text-white border-0 shadow-lg`
            : colorClasses.notTaken
        }`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        {capsuleTaken ? (
          <>
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm leading-tight">Tomei!</span>
          </>
        ) : (
          <div className="text-center leading-tight">
            <div className="font-bold text-base">SB2 TURBO</div>
            <div className="text-sm opacity-90">{isMorning ? "MANHÃ" : "NOITE"}</div>
          </div>
        )}
      </Button>
      
      {capsuleTaken && (
        <div className="text-center mt-3">
          <Badge className={`text-sm ${colorClasses.badge}`}>
            <Sparkles className="w-4 h-4 mr-1" />
            {isMorning ? "Manhã" : "Noite"} OK!
          </Badge>
        </div>
      )}
    </>
  );
};

export default CapsuleButtons;
