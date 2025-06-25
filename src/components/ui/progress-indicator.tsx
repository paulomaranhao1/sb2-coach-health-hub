
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Zap } from "lucide-react";

interface ProgressIndicatorProps {
  userStats: any;
  weightEntries: any[];
  title?: string;
}

const ProgressIndicator = ({ 
  userStats, 
  weightEntries, 
  title = "Seu Progresso" 
}: ProgressIndicatorProps) => {
  if (!userStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum progresso ainda</p>
            <p className="text-sm text-gray-400">
              Comece registrando seu peso para ver seu progresso aqui!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate progress metrics
  const level = userStats.level || 1;
  const points = userStats.points || 0;
  const streak = userStats.streak || 0;
  
  const currentLevelPoints = (level - 1) * 100;
  const nextLevelPoints = level * 100;
  const progressInLevel = points - currentLevelPoints;
  const progressPercentage = Math.min((progressInLevel / 100) * 100, 100);

  const weightLoss = weightEntries.length > 1 ? 
    weightEntries[weightEntries.length - 1]?.weight - weightEntries[0]?.weight : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Nível {level}</span>
            <span className="text-sm text-gray-500">
              {progressInLevel}/100 pontos
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-gray-500 mt-1">
            {100 - progressInLevel} pontos para o nível {level + 1}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{points}</div>
            <div className="text-xs text-gray-500">Pontos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{streak}</div>
            <div className="text-xs text-gray-500">Dias Seguidos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.abs(weightLoss).toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">
              {weightLoss < 0 ? 'Perdido (kg)' : 'Ganho (kg)'}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Conquistas Recentes
          </h4>
          <div className="flex flex-wrap gap-2">
            {userStats.shields?.slice(0, 3).map((shield: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {shield === 'first_weight' ? '🏋️ Primeira Pesagem' : 
                 shield === 'first_fast' ? '⏰ Primeiro Jejum' :
                 shield === 'first_photo' ? '📸 Primeira Foto' : shield}
              </Badge>
            )) || (
              <Badge variant="outline" className="text-xs">
                Nenhuma conquista ainda
              </Badge>
            )}
          </div>
        </div>

        {/* Streak Status */}
        {streak > 0 && (
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Streak Ativo!</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Você registrou peso por {streak} dias seguidos. Continue assim!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressIndicator;
