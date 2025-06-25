
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Camera, Clock, TrendingUp, Plus, ChevronRight } from "lucide-react";
import EmptyStateCard from "./EmptyStateCard";

interface StatusCardsProps {
  weightEntries: any[];
  lastFastingSession: any;
  recentFoodAnalysis: any;
  onAddWeight: () => void;
  onStartFasting: () => void;
  onAnalyzeFood: () => void;
  onViewProgress: () => void;
}

const StatusCards = ({
  weightEntries,
  lastFastingSession,
  recentFoodAnalysis,
  onAddWeight,
  onStartFasting,
  onAnalyzeFood,
  onViewProgress
}: StatusCardsProps) => {
  const hasData = weightEntries.length > 0 || lastFastingSession || recentFoodAnalysis;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Weight Card */}
      {weightEntries.length > 0 ? (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-blue-700">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Peso Atual
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onAddWeight}>
            <div className="text-2xl font-bold text-blue-800 mb-2">
              {weightEntries[0]?.weight}kg
            </div>
            <div className="text-sm text-blue-600">
              {new Date(weightEntries[0]?.date).toLocaleDateString('pt-BR')}
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
              Atualizar peso
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <EmptyStateCard
          title="Peso"
          description="Registre seu peso para começar a acompanhar seu progresso"
          actionText="Registrar Peso"
          onAction={onAddWeight}
          icon="weight"
        />
      )}

      {/* Fasting Card */}
      {lastFastingSession ? (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-purple-700">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Jejum
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onStartFasting}>
            <div className="text-2xl font-bold text-purple-800 mb-2">
              {lastFastingSession.completed ? 'Completado' : 'Em andamento'}
            </div>
            <div className="text-sm text-purple-600">
              {Math.floor(lastFastingSession.duration / 3600)}h de jejum
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800 hover:bg-purple-200">
              {lastFastingSession.completed ? 'Novo jejum' : 'Continuar'}
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <EmptyStateCard
          title="Jejum"
          description="Comece seu primeiro jejum intermitente e monitore seu progresso"
          actionText="Iniciar Jejum"
          onAction={onStartFasting}
          icon="fasting"
        />
      )}

      {/* Food Analysis Card */}
      {recentFoodAnalysis ? (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-green-700">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Última Análise
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onAnalyzeFood}>
            <div className="text-2xl font-bold text-green-800 mb-2">
              {recentFoodAnalysis.total_calories} cal
            </div>
            <div className="text-sm text-green-600">
              {new Date(recentFoodAnalysis.analyzed_at).toLocaleDateString('pt-BR')}
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-200">
              Nova análise
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <EmptyStateCard
          title="Análise de Comida"
          description="Tire uma foto da sua refeição e descubra as calorias instantaneamente"
          actionText="Analisar Comida"
          onAction={onAnalyzeFood}
          icon="photo"
        />
      )}

      {/* Progress Card */}
      {hasData ? (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-orange-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progresso
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onViewProgress}>
            <div className="text-2xl font-bold text-orange-800 mb-2">
              {weightEntries.length > 1 ? 
                `${(weightEntries[weightEntries.length - 1]?.weight - weightEntries[0]?.weight).toFixed(1)}kg` :
                '0.0kg'
              }
            </div>
            <div className="text-sm text-orange-600">
              {weightEntries.length > 1 ? 'Perdido' : 'Sem dados ainda'}
            </div>
            <Badge className="mt-2 bg-orange-100 text-orange-800 hover:bg-orange-200">
              Ver detalhes
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <EmptyStateCard
          title="Progresso"
          description="Acompanhe sua evolução com gráficos e estatísticas detalhadas"
          actionText="Ver Progresso"
          onAction={onViewProgress}
          icon="progress"
        />
      )}
    </div>
  );
};

export default StatusCards;
