
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Flame, Droplets, Wheat, Beef, Share2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

interface NutritionalInfo {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  foods: FoodItem[];
  healthScore: number;
  tips: string[];
}

interface FoodAnalysisResultProps {
  analysis: NutritionalInfo;
  onSave?: (analysis: NutritionalInfo) => void;
}

const FoodAnalysisResult = ({ analysis, onSave }: FoodAnalysisResultProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      const shareText = `Análise SB2FIT:\n🔥 ${analysis.totalCalories} calorias\n💪 ${analysis.totalProtein}g proteína\n🌾 ${analysis.totalCarbs}g carboidrato\n🥑 ${analysis.totalFat}g gordura\n\nPontuação: ${analysis.healthScore}/100`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Análise Nutricional SB2FIT',
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copiado!",
          description: "Análise copiada para área de transferência"
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(analysis);
      toast({
        title: "Salvo!",
        description: "Análise salva no seu histórico"
      });
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900";
    if (score >= 60) return "bg-blue-100 dark:bg-blue-900";
    if (score >= 40) return "bg-orange-100 dark:bg-orange-900";
    return "bg-red-100 dark:bg-red-900";
  };

  return (
    <div className="space-y-6">
      {/* Header com Score */}
      <Card className="border-2 border-red-200 dark:border-red-800">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">
            📊 Análise Nutricional
          </CardTitle>
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getHealthScoreBg(analysis.healthScore)} mx-auto`}>
            <span className={`text-2xl font-bold ${getHealthScoreColor(analysis.healthScore)}`}>
              {analysis.healthScore}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pontuação de Saúde
          </p>
        </CardHeader>
      </Card>

      {/* Resumo Nutricional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            Resumo Nutricional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 mb-2">
                <Flame className="w-3 h-3 mr-1" />
                Calorias
              </Badge>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {analysis.totalCalories}
              </p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            
            <div className="text-center">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 mb-2">
                <Beef className="w-3 h-3 mr-1" />
                Proteína
              </Badge>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.totalProtein}g
              </p>
              <p className="text-xs text-gray-500">
                {Math.round((analysis.totalProtein * 4 / analysis.totalCalories) * 100)}%
              </p>
            </div>
            
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 mb-2">
                <Wheat className="w-3 h-3 mr-1" />
                Carboidrato
              </Badge>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analysis.totalCarbs}g
              </p>
              <p className="text-xs text-gray-500">
                {Math.round((analysis.totalCarbs * 4 / analysis.totalCalories) * 100)}%
              </p>
            </div>
            
            <div className="text-center">
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200 mb-2">
                <Droplets className="w-3 h-3 mr-1" />
                Gordura
              </Badge>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analysis.totalFat}g
              </p>
              <p className="text-xs text-gray-500">
                {Math.round((analysis.totalFat * 9 / analysis.totalCalories) * 100)}%
              </p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600 dark:text-blue-400">Proteína</span>
                <span>{Math.round((analysis.totalProtein * 4 / analysis.totalCalories) * 100)}%</span>
              </div>
              <Progress 
                value={(analysis.totalProtein * 4 / analysis.totalCalories) * 100} 
                className="h-2 bg-blue-100 dark:bg-blue-900"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600 dark:text-green-400">Carboidrato</span>
                <span>{Math.round((analysis.totalCarbs * 4 / analysis.totalCalories) * 100)}%</span>
              </div>
              <Progress 
                value={(analysis.totalCarbs * 4 / analysis.totalCalories) * 100} 
                className="h-2 bg-green-100 dark:bg-green-900"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-600 dark:text-purple-400">Gordura</span>
                <span>{Math.round((analysis.totalFat * 9 / analysis.totalCalories) * 100)}%</span>
              </div>
              <Progress 
                value={(analysis.totalFat * 9 / analysis.totalCalories) * 100} 
                className="h-2 bg-purple-100 dark:bg-purple-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alimentos Detectados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-500" />
            Alimentos Detectados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.foods.map((food, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {food.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {food.quantity}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {food.calories}
                    </span>
                    <p className="text-gray-500">cal</p>
                  </div>
                  <div className="text-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {food.protein}g
                    </span>
                    <p className="text-gray-500">prot</p>
                  </div>
                  <div className="text-center">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {food.carbs}g
                    </span>
                    <p className="text-gray-500">carb</p>
                  </div>
                  <div className="text-center">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {food.fat}g
                    </span>
                    <p className="text-gray-500">gord</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dicas e Recomendações */}
      {analysis.tips.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-300">
              💡 Dicas do AI Coach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Salvar Análise
        </Button>
        
        <Button 
          onClick={handleShare}
          variant="outline"
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default FoodAnalysisResult;
