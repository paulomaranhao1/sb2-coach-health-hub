
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Calendar, Share2 } from "lucide-react";

interface WeightStatisticsProps {
  weightHistory: any[];
  userStats: any;
  initialWeight: number;
  currentWeightValue: number;
  weightLoss: number;
  avgWeightLossPerWeek: string;
  bestWeekLoss: string;
  consistencyScore: number;
  onShare: () => void;
}

const WeightStatistics = ({
  weightHistory,
  userStats,
  initialWeight,
  currentWeightValue,
  weightLoss,
  avgWeightLossPerWeek,
  bestWeekLoss,
  consistencyScore,
  onShare
}: WeightStatisticsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-500" />
            Progresso Total
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {weightHistory.length > 0 ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Peso inicial:</span>
                <span className="font-semibold">{initialWeight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Peso atual:</span>
                <span className="font-semibold">{currentWeightValue} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{weightLoss >= 0 ? 'Perdidos:' : 'Ganhos:'}</span>
                <span className={`font-semibold text-xl ${weightLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weightLoss >= 0 ? '-' : '+'}{Math.abs(weightLoss).toFixed(1)} kg
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center">
              Nenhum registro encontrado
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Velocidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Média/semana:</span>
            <span className="font-semibold">{avgWeightLossPerWeek} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Melhor semana:</span>
            <span className="font-semibold text-green-600">-{bestWeekLoss} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Registros:</span>
            <span className="font-semibold text-blue-600">{weightHistory.length} dias</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Tempo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {weightHistory.length > 0 ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Dias ativos:</span>
                <span className="font-semibold">{weightHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sequência:</span>
                <span className="font-semibold text-orange-600">{userStats?.streak || 0} dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consistência:</span>
                <span className="font-semibold text-purple-600">{consistencyScore}%</span>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center text-sm">
              Comece registrando seu peso
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            💪 Motivação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            {weightHistory.length > 0 && weightLoss > 0 ? (
              <>
                <div className="text-4xl">🎉</div>
                <p className="text-sm text-gray-600">
                  Parabéns! Você já perdeu <span className="font-semibold text-red-600">{weightLoss.toFixed(1)}kg</span>!
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onShare}
                  className="mt-2"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  Compartilhar
                </Button>
              </>
            ) : weightHistory.length > 0 ? (
              <>
                <div className="text-4xl">💪</div>
                <p className="text-sm text-gray-600">
                  Continue firme! Todo esforço vale a pena.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl">🎯</div>
                <p className="text-sm text-gray-600">
                  Registre seu peso na tela inicial para ver suas estatísticas!
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightStatistics;
