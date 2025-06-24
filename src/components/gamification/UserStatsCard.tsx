
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface UserStatsCardProps {
  userStats: {
    level: number;
    points: number;
    shields: string[];
    stickers: string[];
    streak: number;
  } | null;
}

const UserStatsCard = ({ userStats }: UserStatsCardProps) => {
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
};

export default UserStatsCard;
