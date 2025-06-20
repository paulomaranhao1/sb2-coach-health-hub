
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Plus } from "lucide-react";

const WaterTracker = () => {
  const [waterCount, setWaterCount] = useState(0);
  const [bottleCount, setBottleCount] = useState(0);

  const addGlass = () => {
    setWaterCount(prev => prev + 1);
  };

  const addBottle = () => {
    setBottleCount(prev => prev + 1);
  };

  // Cálculo da água consumida (200ml por copo + 500ml por garrafa)
  const waterConsumedMl = (waterCount * 200) + (bottleCount * 500);
  const recommendedWaterMl = 2500; // Atualizado para 2500ml (recomendação mais atual)
  const waterPercentage = Math.min(waterConsumedMl / recommendedWaterMl * 100, 100);

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Button 
            onClick={addGlass} 
            variant="outline" 
            className="h-16 border-2 border-blue-400 dark:border-blue-500 text-slate-800 dark:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50 bg-white/70 dark:bg-blue-900/20 transition-all duration-300 flex flex-col items-center justify-center gap-1"
          >
            <Droplets className="w-5 h-5 flex-shrink-0" />
            <div className="text-center leading-tight">
              <div className="font-semibold text-sm">COPO</div>
              <div className="text-xs opacity-90">200ml</div>
            </div>
          </Button>

          <Button 
            onClick={addBottle} 
            variant="outline" 
            className="h-16 border-2 border-cyan-400 dark:border-cyan-500 text-slate-800 dark:text-cyan-300 hover:bg-cyan-200/50 dark:hover:bg-cyan-800/50 bg-white/70 dark:bg-cyan-900/20 transition-all duration-300 flex flex-col items-center justify-center gap-1"
          >
            <Droplets className="w-5 h-5 flex-shrink-0" />
            <div className="text-center leading-tight">
              <div className="font-semibold text-sm">GARRAFA</div>
              <div className="text-xs opacity-90">500ml</div>
            </div>
          </Button>
        </div>
        
        {/* Informações detalhadas da água */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Consumido hoje:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {waterConsumedMl}ml ({waterCount} copos + {bottleCount} garrafas)
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Meta diária:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {recommendedWaterMl}ml
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
            Recomendação: 35ml por kg de peso corporal (média de 2,5L/dia)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterTracker;
