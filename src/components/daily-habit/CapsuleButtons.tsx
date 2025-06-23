
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
        taken: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg",
        notTaken: "border-2 border-orange-400 text-orange-700 hover:bg-orange-50 bg-white",
        badge: "bg-orange-100 text-orange-800 border-orange-200"
      }
    : {
        taken: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white border-0 shadow-lg",
        notTaken: "border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-50 bg-white",
        badge: "bg-indigo-100 text-indigo-800 border-indigo-200"
      };

  return (
    <>
      <Button
        onClick={handleCapsuleClick}
        variant={capsuleTaken ? "default" : "outline"}
        className={`w-full h-24 text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
          capsuleTaken 
            ? colorClasses.taken
            : colorClasses.notTaken
        }`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        {capsuleTaken ? (
          <>
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm leading-tight font-bold">Tomei!</span>
          </>
        ) : (
          <div className="text-center leading-tight">
            <div className="font-bold text-base">SB2 TURBO</div>
            <div className="text-sm opacity-90 font-semibold">{isMorning ? "MANHÃ" : "NOITE"}</div>
          </div>
        )}
      </Button>
      
      {capsuleTaken && (
        <div className="text-center mt-3">
          <Badge className={`text-sm font-bold ${colorClasses.badge}`}>
            <Sparkles className="w-4 h-4 mr-1" />
            {isMorning ? "Manhã" : "Noite"} OK!
          </Badge>
        </div>
      )}
    </>
  );
};

export default CapsuleButtons;
