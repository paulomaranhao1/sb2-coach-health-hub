
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets } from "lucide-react";

const WaterTracker = () => {
  const [waterCount, setWaterCount] = useState(0);

  const addWater = () => {
    setWaterCount(prev => prev + 1);
  };

  // Cálculo da água consumida e recomendada (fixo em 2000ml)
  const waterConsumedMl = waterCount * 200; // 200ml por copo
  const recommendedWaterMl = 2000; // 2000ml fixo (10 copos)
  const waterPercentage = Math.min((waterConsumedMl / recommendedWaterMl) * 100, 100);

  return (
    <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <Button 
          onClick={addWater}
          variant="outline" 
          className="w-full h-20 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent transition-all duration-300 flex flex-col items-center justify-center gap-2"
        >
          <Droplets className="w-6 h-6 flex-shrink-0" />
          <div className="text-center leading-tight">
            <div className="font-semibold text-base">BEBI UM COPO</div>
            <div className="text-sm opacity-90">DE ÁGUA (200ml)</div>
          </div>
        </Button>
        
        {/* Informações detalhadas da água */}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Consumido hoje:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {waterConsumedMl}ml ({waterCount} copos)
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Meta diária:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {recommendedWaterMl}ml (10 copos)
            </span>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${waterPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <Badge 
              variant="outline" 
              className={`text-sm ${
                waterPercentage >= 100 
                  ? 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-600' 
                  : 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600'
              }`}
            >
              {waterPercentage.toFixed(0)}% da meta diária
              {waterPercentage >= 100 && ' 🎉'}
            </Badge>
          </div>
          
          <div className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
            Meta padrão: 2000ml (10 copos) por dia
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterTracker;
