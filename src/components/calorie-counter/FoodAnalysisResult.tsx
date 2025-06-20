
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Save, Share2, Flame, Apple, Zap, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveFoodAnalysis } from '@/lib/foodAnalysis';

interface FoodAnalysisResultProps {
  analysis: {
    foods: Array<{
      name: string;
      quantity: string;
      calories: number;
      confidence: number;
    }>;
    totalCalories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    recommendations: string[];
  };
  imageUrl: string | null;
  onReset: () => void;
}

const FoodAnalysisResult = ({ analysis, imageUrl, onReset }: FoodAnalysisResultProps) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveFoodAnalysis(analysis, imageUrl);
      toast({
        title: "✅ Análise Salva!",
        description: "Sua refeição foi adicionada ao histórico.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a análise.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Análise Nutricional - SB2coach.ai',
          text: `Acabei de analisar minha refeição: ${analysis.totalCalories} calorias!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copiar para clipboard
      const text = `Minha refeição analisada pelo SB2coach.ai: ${analysis.totalCalories} calorias, ${analysis.macros.protein}g proteína, ${analysis.macros.carbs}g carboidratos, ${analysis.macros.fat}g gordura.`;
      navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Informações copiadas para a área de transferência.",
      });
    }
  };

  const totalMacros = analysis.macros.protein + analysis.macros.carbs + analysis.macros.fat;

  return (
    <div className="space-y-6">
      {/* Resumo Principal */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-600" />
              <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                {analysis.totalCalories} calorias
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" variant="outline">
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              <Button onClick={handleShare} size="sm" variant="outline">
                <Share2 className="w-4 h-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm font-medium">Proteína</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{analysis.macros.protein}g</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Apple className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">Carboidratos</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{analysis.macros.carbs}g</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Droplets className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm font-medium">Gordura</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{analysis.macros.fat}g</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-sm font-medium">Fibra</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{analysis.macros.fiber}g</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição de Macronutrientes */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Macronutrientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-red-600">Proteína</span>
                <span className="text-sm">{Math.round((analysis.macros.protein / totalMacros) * 100)}%</span>
              </div>
              <Progress value={(analysis.macros.protein / totalMacros) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-yellow-600">Carboidratos</span>
                <span className="text-sm">{Math.round((analysis.macros.carbs / totalMacros) * 100)}%</span>
              </div>
              <Progress value={(analysis.macros.carbs / totalMacros) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-600">Gordura</span>
                <span className="text-sm">{Math.round((analysis.macros.fat / totalMacros) * 100)}%</span>
              </div>
              <Progress value={(analysis.macros.fat / totalMacros) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alimentos Identificados */}
      <Card>
        <CardHeader>
          <CardTitle>Alimentos Identificados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.foods.map((food, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{food.quantity}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={food.confidence > 0.8 ? "default" : "secondary"}>
                    {Math.round(food.confidence * 100)}% confiança
                  </Badge>
                  <div className="text-right">
                    <div className="font-bold">{food.calories}</div>
                    <div className="text-xs text-gray-500">calorias</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      {analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Recomendações SB2 Turbo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão para Nova Análise */}
      <div className="text-center">
        <Button onClick={onReset} variant="outline" size="lg">
          📸 Analisar Nova Foto
        </Button>
      </div>
    </div>
  );
};

export default FoodAnalysisResult;
