
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Activity } from "lucide-react";
import { FoodAnalysis } from '@/lib/food';

interface FoodAnalysisResultProps {
  analysis: FoodAnalysis;
}

const FoodAnalysisResult = ({ analysis }: FoodAnalysisResultProps) => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Utensils className="w-5 h-5" />
          Resultado da Análise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {analysis.totalCalories}
          </div>
          <div className="text-sm text-gray-600">calorias totais</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-red-600">
              {analysis.macros.protein}g
            </div>
            <div className="text-xs text-gray-600">Proteína</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {analysis.macros.carbs}g
            </div>
            <div className="text-xs text-gray-600">Carboidratos</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-purple-600">
              {analysis.macros.fat}g
            </div>
            <div className="text-xs text-gray-600">Gorduras</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-green-600">
              {analysis.macros.fiber}g
            </div>
            <div className="text-xs text-gray-600">Fibras</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Alimentos Identificados
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.foods.map((food, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {food.name} ({food.calories} cal)
              </Badge>
            ))}
          </div>
        </div>

        {analysis.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Recomendações</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodAnalysisResult;
