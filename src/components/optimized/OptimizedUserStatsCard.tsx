
import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedUserStatsCardProps {
  userStats: {
    level: number;
    points: number;
    shields: string[];
    stickers: string[];
    streak: number;
  } | null;
  loading?: boolean;
}

const OptimizedUserStatsCard = memo(({ userStats, loading }: OptimizedUserStatsCardProps) => {
  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <Skeleton className="h-6 w-20 bg-red-400/30" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48 bg-red-400/30" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full bg-red-400/30 mb-2" />
          <Skeleton className="h-4 w-32 bg-red-400/30" />
        </CardContent>
      </Card>
    );
  }

  // Provide default values if userStats is null
  const stats = userStats || {
    level: 1,
    points: 0,
    shields: [],
    stickers: [],
    streak: 0
  };

  return (
    <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Nível {stats.level}
        </CardTitle>
        <CardDescription className="text-red-100">
          {stats.points} pontos • {stats.shields.length} escudos • {stats.stickers.length} figurinhas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="bg-red-400/30 rounded-full h-3">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${(stats.points % 100)}%` }}
              />
            </div>
            <p className="text-sm text-red-100 mt-1">
              {100 - (stats.points % 100)} pontos para o próximo nível
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-sm text-red-100">dias seguidos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedUserStatsCard.displayName = 'OptimizedUserStatsCard';

export default OptimizedUserStatsCard;
