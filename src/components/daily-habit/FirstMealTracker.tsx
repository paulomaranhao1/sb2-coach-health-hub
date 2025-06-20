
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
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <CardContent className="p-5">
        <Button
          onClick={handleMealClick}
          variant={mealCompleted ? "default" : "outline"}
          className={`w-full h-20 text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            mealCompleted 
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg" 
              : "border-2 border-green-400 dark:border-green-500 text-green-700 dark:text-green-300 hover:bg-green-200/50 dark:hover:bg-green-800/50 bg-white dark:bg-slate-800"
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
            <Badge className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm border-green-300 dark:border-green-600">
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
