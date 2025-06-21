import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Flame, Calendar, Eye } from "lucide-react";
import { getFoodAnalysisHistory } from '@/lib/food';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AnalysisHistoryProps {
  refreshTrigger?: number;
}

const AnalysisHistory = ({ refreshTrigger }: AnalysisHistoryProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getFoodAnalysisHistory(20);
      setHistory(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando histórico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Análises
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nenhuma análise ainda</p>
            <p className="text-sm">Suas análises de fotos aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Análises ({history.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((analysis, index) => (
              <div 
                key={analysis.id || index} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold">{analysis.total_calories} calorias</span>
                    <Badge variant="outline" className="text-xs">
                      {analysis.foods?.length || 0} alimentos
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {format(new Date(analysis.analyzed_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    P: {analysis.macros?.protein || 0}g | 
                    C: {analysis.macros?.carbs || 0}g | 
                    G: {analysis.macros?.fat || 0}g
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedAnalysis(selectedAnalysis?.id === analysis.id ? null : analysis)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes da análise selecionada */}
      {selectedAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Alimentos */}
              <div>
                <h4 className="font-medium mb-2">Alimentos Identificados:</h4>
                <div className="space-y-2">
                  {selectedAnalysis.foods?.map((food: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div>
                        <span className="font-medium">{food.name}</span>
                        <span className="text-sm text-gray-600 ml-2">({food.quantity})</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{food.calories} cal</div>
                        <div className="text-xs text-gray-500">{Math.round(food.confidence * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendações */}
              {selectedAnalysis.recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recomendações:</h4>
                  <div className="space-y-1">
                    {selectedAnalysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="text-sm p-2 bg-blue-50 dark:bg-blue-950 rounded border-l-2 border-blue-500">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisHistory;
