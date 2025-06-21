
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'weight' | 'fasting' | 'calories' | 'general';
  points: number;
  requirement: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  return (
    <Card 
      className={`${achievement.isUnlocked 
        ? 'border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
        : 'border-gray-200 bg-gray-50 opacity-70'
      } transition-all duration-300 hover:shadow-lg`}
    >
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="text-4xl">{achievement.emoji}</div>
          <div>
            <h3 className="font-bold text-lg">{achievement.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
            <p className="text-xs text-gray-500 mt-2">{achievement.requirement}</p>
          </div>
          
          <div className="flex items-center justify-between">
            {achievement.isUnlocked ? (
              <Badge className="bg-green-600 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                Desbloqueada
              </Badge>
            ) : (
              <Badge variant="secondary">Bloqueada</Badge>
            )}
            {achievement.points > 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                +{achievement.points} pts
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
