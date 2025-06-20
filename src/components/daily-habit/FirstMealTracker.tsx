
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Utensils } from "lucide-react";

const FirstMealTracker = () => {
  const [mealCompleted, setMealCompleted] = useState(false);

  const handleMealClick = () => {
    setMealCompleted(!mealCompleted);
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30">
      <CardContent className="p-5">
        <Button
          onClick={handleMealClick}
          variant={mealCompleted ? "default" : "outline"}
          className={`w-full h-20 text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            mealCompleted 
              ? "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0 shadow-lg" 
              : "border-2 border-yellow-400 dark:border-yellow-500 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200/50 dark:hover:bg-yellow-800/50 bg-white/70 dark:bg-yellow-900/20"
          }`}
        >
          <Utensils className="w-6 h-6 flex-shrink-0" />
          {mealCompleted ? (
            <>
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm leading-tight">Feito!</span>
            </>
          ) : (
            <div className="text-center leading-tight">
              <div className="font-bold text-base">PRIMEIRA REFEIÇÃO</div>
              <div className="text-sm opacity-90">DO DIA</div>
            </div>
          )}
        </Button>
        
        {mealCompleted && (
          <div className="text-center mt-3">
            <Badge className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm border-yellow-300 dark:border-yellow-600">
              <Utensils className="w-4 h-4 mr-1" />
              Primeira refeição OK!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FirstMealTracker;
