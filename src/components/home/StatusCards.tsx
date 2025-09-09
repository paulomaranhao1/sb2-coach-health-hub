
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Camera, Clock, TrendingUp, Plus, ChevronRight } from "lucide-react";
import EmptyStateCard from "./EmptyStateCard";

interface StatusCardsProps {
  userProfile?: any;
  userStats?: any;
  weightEntries?: any[];
  lastFastingSession?: any;
  recentFoodAnalysis?: any;
  onAddWeight?: () => void;
  onStartFasting?: () => void;
  onAnalyzeFood?: () => void;
  onViewProgress?: () => void;
}

const StatusCards = ({
  userProfile,
  userStats,
  weightEntries = [],
  lastFastingSession,
  recentFoodAnalysis,
  onAddWeight = () => {},
  onStartFasting = () => {},
  onAnalyzeFood = () => {},
  onViewProgress = () => {}
}: StatusCardsProps) => {
  const hasData = weightEntries.length > 0 || lastFastingSession || recentFoodAnalysis;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Weight Card */}
      {weightEntries.length > 0 ? (
        <Card className="bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60 border-blue-100/60 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-blue-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/80 rounded-xl">
                  <Scale className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-semibold">Peso Atual</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onAddWeight}>
            <div className="text-3xl font-bold text-blue-800 mb-2 tracking-tight">
              {weightEntries[0]?.weight}kg
            </div>
            <div className="text-sm text-blue-600 font-medium">
              {new Date(weightEntries[0]?.date).toLocaleDateString('pt-BR')}
            </div>
            <Badge className="mt-3 bg-blue-100/80 text-blue-800 hover:bg-blue-200 transition-colors duration-200 font-medium">
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
        <Card className="bg-gradient-to-br from-purple-50/80 via-white to-pink-50/60 border-purple-100/60 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-purple-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100/80 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <span className="font-semibold">Jejum</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onStartFasting}>
            <div className="text-3xl font-bold text-purple-800 mb-2 tracking-tight">
              {lastFastingSession.completed ? 'Completado' : 'Em andamento'}
            </div>
            <div className="text-sm text-purple-600 font-medium">
              {Math.floor(lastFastingSession.duration / 3600)}h de jejum
            </div>
            <Badge className="mt-3 bg-purple-100/80 text-purple-800 hover:bg-purple-200 transition-colors duration-200 font-medium">
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
        <Card className="bg-gradient-to-br from-green-50/80 via-white to-emerald-50/60 border-green-100/60 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-green-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100/80 rounded-xl">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-semibold">Última Análise</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onAnalyzeFood}>
            <div className="text-3xl font-bold text-green-800 mb-2 tracking-tight">
              {recentFoodAnalysis.total_calories} cal
            </div>
            <div className="text-sm text-green-600 font-medium">
              {new Date(recentFoodAnalysis.analyzed_at).toLocaleDateString('pt-BR')}
            </div>
            <Badge className="mt-3 bg-green-100/80 text-green-800 hover:bg-green-200 transition-colors duration-200 font-medium">
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
        <Card className="bg-gradient-to-br from-orange-50/80 via-white to-red-50/60 border-orange-100/60 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-orange-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100/80 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <span className="font-semibold">Progresso</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </CardTitle>
          </CardHeader>
          <CardContent onClick={onViewProgress}>
            <div className="text-3xl font-bold text-orange-800 mb-2 tracking-tight">
              {weightEntries.length > 1 ? 
                `${(weightEntries[weightEntries.length - 1]?.weight - weightEntries[0]?.weight).toFixed(1)}kg` :
                '0.0kg'
              }
            </div>
            <div className="text-sm text-orange-600 font-medium">
              {weightEntries.length > 1 ? 'Perdido' : 'Sem dados ainda'}
            </div>
            <Badge className="mt-3 bg-orange-100/80 text-orange-800 hover:bg-orange-200 transition-colors duration-200 font-medium">
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
