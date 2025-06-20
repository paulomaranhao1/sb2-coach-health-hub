
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Save, Share2, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FoodAnalysis, saveFoodAnalysis } from '@/lib/foodAnalysis';

interface FoodAnalysisResultProps {
  analysis: FoodAnalysis;
  imageUrl: string | null;
  onReset: () => void;
}

const FoodAnalysisResult = ({ analysis, imageUrl, onReset }: FoodAnalysisResultProps) => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveFoodAnalysis(analysis, imageUrl);
      toast({
        title: "✅ Análise Salva!",
        description: "Sua análise foi salva no histórico com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar a análise. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const shareText = `🍽️ Análise Nutricional - SB2coach.ai\n\n` +
      `📊 Total: ${analysis.totalCalories} calorias\n` +
      `🥩 Proteína: ${analysis.macros.protein}g\n` +
      `🍞 Carboidratos: ${analysis.macros.carbs}g\n` +
      `🥑 Gordura: ${analysis.macros.fat}g\n` +
      `🌾 Fibra: ${analysis.macros.fiber}g\n\n` +
      `Alimentos detectados:\n${analysis.foods.map(food => `• ${food.name} (${food.quantity})`).join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Análise Nutricional - SB2coach.ai',
          text: shareText,
        });
      } catch (error) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      // Fallback para clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "📋 Copiado!",
          description: "Análise copiada para a área de transferência!",
        });
      } catch (error) {
        console.error('Erro ao copiar:', error);
      }
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.6) return 'Média';
    return 'Baixa';
  };

  return (
    <div className="space-y-6">
      {/* Resultado Principal */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-2 border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-800 dark:text-green-200">
                {analysis.totalCalories} calorias
              </span>
            </div>
            <Badge variant="secondary" className="text-sm">
              ✨ Análise IA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Macronutrientes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">🥩</div>
              <div className="text-sm font-semibold">{analysis.macros.protein}g</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Proteína</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">🍞</div>
              <div className="text-sm font-semibold">{analysis.macros.carbs}g</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Carboidratos</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">🥑</div>
              <div className="text-sm font-semibold">{analysis.macros.fat}g</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Gordura</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-green-600">🌾</div>
              <div className="text-sm font-semibold">{analysis.macros.fiber}g</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Fibra</div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Análise'}
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button 
              onClick={onReset}
              variant="secondary"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Nova Análise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alimentos Detectados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Alimentos Detectados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.foods.map((food, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  {food.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {food.quantity} • {food.calories} calorias
                </p>
              </div>
              <div className="text-right">
                <Badge 
                  variant="secondary" 
                  className={`${getConfidenceColor(food.confidence)} text-white text-xs`}
                >
                  {getConfidenceText(food.confidence)} ({Math.round(food.confidence * 100)}%)
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Recomendações Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-blue-600 font-bold text-lg mt-0.5">•</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {recommendation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodAnalysisResult;
