
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Calendar, Trophy, Plus, Star, Award } from "lucide-react";
import StatusCards from './StatusCards';
import GamificationCards from './GamificationCards';
import SmartCTA from '@/components/ui/smart-cta';
import ProgressIndicator from '@/components/ui/progress-indicator';
import WelcomeSection from './WelcomeSection';
import HomeActions from './HomeActions';

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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeSection 
        userProfile={userProfile}
        userStats={userStats}
        weightEntries={weightEntries}
      />

      {/* Smart CTA */}
      <SmartCTA 
        userStats={userStats}
        weightEntries={weightEntries}
        onAction={handleSmartAction}
      />

      {/* Quick Actions */}
      <HomeActions
        onAddWeight={onAddWeight}
        onStartFasting={onStartFasting}
        onAnalyzeFood={onAnalyzeFood}
        onViewProgress={onViewProgress}
      />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-white shadow-lg border-0">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <TrendingUp className="w-5 h-5" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2 text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Target className="w-5 h-5" />
            Progresso
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2 text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Trophy className="w-5 h-5" />
            Conquistas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-8">
          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Dias Ativos</p>
                    <p className="text-3xl font-bold text-blue-900">{weightEntries.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-500 p-3 rounded-full">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Nível Atual</p>
                    <p className="text-3xl font-bold text-yellow-900">{userStats?.level || 1}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-500 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Sequência</p>
                    <p className="text-3xl font-bold text-emerald-900">{userStats?.streak || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-500 p-3 rounded-full">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Conquistas</p>
                    <p className="text-3xl font-bold text-purple-900">{userStats?.shields?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Star className="w-6 h-6 text-yellow-500" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weightEntries.length > 0 ? (
                <div className="space-y-4">
                  {weightEntries.slice(0, 3).map((entry: any, index: number) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-500 p-2 rounded-full">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">Peso registrado: {entry.weight}kg</p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {index === 0 ? 'Mais recente' : `${index + 1}º mais recente`}
                      </Badge>
                    </div>
                  ))}
                  {weightEntries.length > 3 && (
                    <Button 
                      variant="outline" 
                      onClick={onViewProgress}
                      className="w-full mt-4 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold"
                    >
                      Ver todos os registros
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-blue-500" />
                  </div>
                  <p className="text-gray-600 text-lg mb-4">Nenhuma atividade ainda</p>
                  <p className="text-sm text-gray-500 mb-8">
                    Registre seu primeiro peso e comece sua jornada de transformação!
                  </p>
                  <Button onClick={onAddWeight} size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Registrar primeiro peso
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6 mt-8">
          <ProgressIndicator 
            userStats={userStats}
            weightEntries={weightEntries}
            title="Seu Progresso Detalhado"
          />
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6 mt-8">
          <GamificationCards userStats={userStats} />
          
          {/* Próximas Conquistas */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Target className="w-6 h-6 text-purple-500" />
                Próximas Conquistas
              </CardTitle>
              <CardDescription className="text-lg">
                Complete estas metas e ganhe pontos extras!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!userStats?.shields?.includes('first_weight') && (
                  <div className="p-4 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                    <p className="font-bold text-blue-800 text-lg">🏋️ Primeira Pesagem</p>
                    <p className="text-blue-600">Registre seu primeiro peso e ganhe 50 pontos</p>
                  </div>
                )}
                
                {(userStats?.streak || 0) < 7 && (
                  <div className="p-4 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50">
                    <p className="font-bold text-orange-800 text-lg">🔥 Sequência de 7 Dias</p>
                    <p className="text-orange-600">
                      Registre peso por 7 dias seguidos e ganhe 100 pontos bônus ({userStats?.streak || 0}/7)
                    </p>
                  </div>
                )}

                {!userStats?.shields?.includes('first_fast') && (
                  <div className="p-4 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50">
                    <p className="font-bold text-purple-800 text-lg">⏰ Primeiro Jejum</p>
                    <p className="text-purple-600">Complete seu primeiro jejum e ganhe 75 pontos</p>
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
