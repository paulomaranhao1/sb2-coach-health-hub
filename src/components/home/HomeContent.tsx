
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Calendar, Trophy, Plus } from "lucide-react";
import StatusCards from './StatusCards';
import GamificationCards from './GamificationCards';
import SmartCTA from '@/components/ui/smart-cta';
import ProgressIndicator from '@/components/ui/progress-indicator';
import { useNavigate } from 'react-router-dom';

interface HomeContentProps {
  userProfile: any;
  userStats: any;
  weightEntries: any[];
  lastFastingSession?: any;
  recentFoodAnalysis?: any;
  onAddWeight: () => void;
  onStartFasting: () => void;
  onAnalyzeFood: () => void;
  onViewProgress: () => void;
}

const HomeContent = ({
  userProfile,
  userStats,
  weightEntries,
  lastFastingSession,
  recentFoodAnalysis,
  onAddWeight,
  onStartFasting,
  onAnalyzeFood,
  onViewProgress
}: HomeContentProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleSmartAction = (action: string) => {
    switch (action) {
      case 'weight':
        onAddWeight();
        break;
      case 'fasting':
        onStartFasting();
        break;
      case 'food':
        onAnalyzeFood();
        break;
      case 'progress':
        onViewProgress();
        break;
      default:
        break;
    }
  };

  const getWelcomeMessage = () => {
    const name = userProfile?.name || 'Usuário';
    const hour = new Date().getHours();
    
    if (hour < 12) return `Bom dia, ${name}! 🌅`;
    if (hour < 18) return `Boa tarde, ${name}! ☀️`;
    return `Boa noite, ${name}! 🌙`;
  };

  const getMotivationalMessage = () => {
    if (!userStats) return "Comece sua jornada hoje!";
    
    const { points, streak, level } = userStats;
    
    if (streak >= 7) return `Incrível! ${streak} dias de consistência! 🔥`;
    if (points >= 100) return `Nível ${level}! Você está evoluindo! 🚀`;
    if (weightEntries.length >= 5) return "Você está no caminho certo! 💪";
    return "Continue firme na sua jornada! 🎯";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">
            {getWelcomeMessage()}
          </CardTitle>
          <CardDescription className="text-blue-600 text-lg">
            {getMotivationalMessage()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Smart CTA */}
      <SmartCTA 
        userStats={userStats}
        weightEntries={weightEntries}
        onAction={handleSmartAction}
      />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Progresso
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Conquistas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatusCards
            userProfile={userProfile}
            userStats={userStats}
            weightEntries={weightEntries}
            lastFastingSession={lastFastingSession}
            recentFoodAnalysis={recentFoodAnalysis}
            onAddWeight={onAddWeight}
            onStartFasting={onStartFasting}
            onAnalyzeFood={onAnalyzeFood}
            onViewProgress={onViewProgress}
          />

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Dias Ativos</p>
                    <p className="text-2xl font-bold">{weightEntries.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Nível Atual</p>
                    <p className="text-2xl font-bold">{userStats?.level || 1}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Streak</p>
                    <p className="text-2xl font-bold">{userStats?.streak || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Escudos</p>
                    <p className="text-2xl font-bold">{userStats?.shields?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weightEntries.length > 0 ? (
                <div className="space-y-3">
                  {weightEntries.slice(0, 3).map((entry: any, index: number) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Peso registrado: {entry.weight}kg</p>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {index === 0 ? 'Mais recente' : `${index + 1}º mais recente`}
                      </Badge>
                    </div>
                  ))}
                  {weightEntries.length > 3 && (
                    <Button 
                      variant="ghost" 
                      onClick={onViewProgress}
                      className="w-full"
                    >
                      Ver todos os registros
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhuma atividade ainda</p>
                  <Button onClick={onAddWeight} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Registrar primeiro peso
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <ProgressIndicator 
            userStats={userStats}
            weightEntries={weightEntries}
            title="Seu Progresso Detalhado"
          />
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6">
          <GamificationCards userStats={userStats} />
          
          {/* Próximas Conquistas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Próximas Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!userStats?.shields?.includes('first_weight') && (
                  <div className="p-3 border border-dashed border-blue-300 rounded-lg">
                    <p className="font-medium text-blue-700">🏋️ Primeira Pesagem</p>
                    <p className="text-sm text-blue-600">Registre seu primeiro peso (+50 pontos)</p>
                  </div>
                )}
                
                {(userStats?.streak || 0) < 7 && (
                  <div className="p-3 border border-dashed border-orange-300 rounded-lg">
                    <p className="font-medium text-orange-700">🔥 Streak de 7 Dias</p>
                    <p className="text-sm text-orange-600">
                      Registre peso por 7 dias seguidos ({userStats?.streak || 0}/7)
                    </p>
                  </div>
                )}

                {!userStats?.shields?.includes('first_fast') && (
                  <div className="p-3 border border-dashed border-purple-300 rounded-lg">
                    <p className="font-medium text-purple-700">⏰ Primeiro Jejum</p>
                    <p className="text-sm text-purple-600">Complete seu primeiro jejum (+75 pontos)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeContent;
