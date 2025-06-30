
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Shield, Zap } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedGamificationCardsProps {
  userStats: any;
  loading?: boolean;
}

const LoadingSkeleton = memo(() => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-[10px] px-[10px] bg-slate-200 rounded-2xl">
    {Array.from({ length: 4 }).map((_, index) => (
      <Card key={index} className="glass border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-6 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const OptimizedGamificationCards = memo(({ userStats, loading }: OptimizedGamificationCardsProps) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!userStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-[10px] px-[10px] bg-slate-200 rounded-2xl">
        {/* Empty state cards - same as existing implementation */}
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Nível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">1</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
              Registre seu primeiro peso para começar!
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Star className="w-5 h-5 text-yellow-500" />
              Pontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">0</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
              Comece sua jornada e ganhe pontos!
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Shield className="w-5 h-5 text-blue-500" />
              Escudos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">0</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
              Conquiste seus primeiros escudos!
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Zap className="w-5 h-5 text-purple-500" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">0</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
              Mantenha a consistência diária!
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcular progresso para próximo nível
  const currentLevelPoints = (userStats.level - 1) * 100;
  const progressInLevel = userStats.points - currentLevelPoints;
  const progressPercentage = (progressInLevel / 100) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-[10px] px-[10px] bg-slate-200 rounded-2xl">
      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Nível {userStats.level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {userStats.points} pontos
          </div>
          <div className="space-y-2">
            <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {100 - progressInLevel} pontos para nível {userStats.level + 1}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Shield className="w-5 h-5 text-blue-500" />
            Escudos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {userStats.shields?.length || 0}
          </div>
          <div className="flex flex-wrap gap-1">
            {userStats.shields?.slice(0, 3).map((shield: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {shield === 'first_weight' ? '🏋️ Primeira Pesagem' : 
                 shield === 'first_fast' ? '⏰ Primeiro Jejum' :
                 shield === 'first_photo' ? '📸 Primeira Foto' : shield}
              </Badge>
            ))}
            {(userStats.shields?.length || 0) > 3 && (
              <Badge variant="outline" className="text-xs">
                +{(userStats.shields?.length || 0) - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Zap className="w-5 h-5 text-purple-500" />
            Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {userStats.streak || 0}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {userStats.streak > 0 ? 
              `${userStats.streak} dias seguidos! 🔥` : 
              'Comece seu streak hoje!'
            }
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Star className="w-5 h-5 text-yellow-500" />
            Atividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Fotos:</span>
              <span className="font-semibold">{userStats.total_photos_analyzed || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Calorias:</span>
              <span className="font-semibold">{userStats.total_calories_tracked || 0}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {userStats.last_activity_date ? 
                `Última atividade: ${new Date(userStats.last_activity_date).toLocaleDateString('pt-BR')}` :
                'Nenhuma atividade ainda'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

OptimizedGamificationCards.displayName = 'OptimizedGamificationCards';

export default OptimizedGamificationCards;
