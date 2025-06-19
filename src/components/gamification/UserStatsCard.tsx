
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface UserStatsCardProps {
  userStats: {
    level: number;
    points: number;
    shields: string[];
    stickers: string[];
    streak: number;
  };
}

const UserStatsCard = ({ userStats }: UserStatsCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Nível {userStats.level}
        </CardTitle>
        <CardDescription className="text-red-100">
          {userStats.points} pontos • {userStats.shields.length} escudos • {userStats.stickers.length} figurinhas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="bg-red-400/30 rounded-full h-3">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${(userStats.points % 100)}%` }}
              />
            </div>
            <p className="text-sm text-red-100 mt-1">
              {100 - (userStats.points % 100)} pontos para o próximo nível
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{userStats.streak}</div>
            <div className="text-sm text-red-100">dias seguidos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
