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
  const waterConsumedMl = waterCount * 200 + bottleCount * 500;
  const recommendedWaterMl = 2500; // Recomendação atual
  const waterPercentage = Math.min(waterConsumedMl / recommendedWaterMl * 100, 100);
  return <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardContent className="p-5 bg-slate-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Button onClick={addGlass} variant="outline" className="h-16 border-2 border-blue-400 text-blue-700 hover:bg-blue-50 bg-white transition-all duration-300 flex flex-col items-center justify-center gap-1 rounded-xl">
            <Droplets className="w-5 h-5 flex-shrink-0" />
            <div className="text-center leading-tight">
              <div className="font-semibold text-sm">COPO</div>
              <div className="text-xs opacity-90">200ml</div>
            </div>
          </Button>

          <Button onClick={addBottle} variant="outline" className="h-16 border-2 border-cyan-400 text-cyan-700 hover:bg-cyan-50 bg-white transition-all duration-300 flex flex-col items-center justify-center gap-1 rounded-xl">
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
            <span className="font-semibold text-slate-300">Consumido hoje:</span>
            <span className="text-base font-semibold text-left text-slate-300">
              {waterConsumedMl}ml ({waterCount} copos + {bottleCount} garrafas)
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Meta diária:</span>
            <span className="font-semibold text-slate-300">
              {recommendedWaterMl}ml
            </span>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{
            width: `${waterPercentage}%`
          }}></div>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className={`text-sm ${waterPercentage >= 100 ? 'text-green-600 border-green-300 bg-green-50' : 'text-blue-600 border-blue-300 bg-blue-50'}`}>
              {waterPercentage.toFixed(0)}% da meta diária
              {waterPercentage >= 100 && ' 🎉'}
            </Badge>
          </div>
          
          <div className="text-xs text-center text-slate-400 mt-2">
            Recomendação: 35ml por kg de peso corporal (média de 2,5L/dia)
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default WaterTracker;