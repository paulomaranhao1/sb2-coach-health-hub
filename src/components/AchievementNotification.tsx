
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, X, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  type: 'shield' | 'sticker';
  name: string;
  emoji: string;
  description: string;
  rarity?: string;
}

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementNotification = ({ achievements, onClose }: AchievementNotificationProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (achievements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % achievements.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [achievements.length]);

  if (achievements.length === 0) return null;

  const current = achievements[currentIndex];

  const shareAchievement = async (achievement: Achievement) => {
    try {
      const shareData = {
        title: 'SB2coach.ai - Nova Conquista!',
        text: `Acabei de conquistar ${achievement.emoji} ${achievement.name} no SB2coach.ai! ${achievement.description}`,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copiado!",
          description: "Cole onde quiser compartilhar sua conquista"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'comum': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'raro': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'épico': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="border-2 border-red-400 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 shadow-2xl animate-scale-in">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="font-bold text-red-800 dark:text-red-200">
                {current.type === 'shield' ? 'Novo Escudo!' : 'Nova Figurinha!'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center space-y-3">
            <div className="text-4xl">{current.emoji}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{current.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{current.description}</p>
              {current.rarity && (
                <Badge className={`mt-2 ${getRarityColor(current.rarity)}`}>
                  {current.rarity}
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={() => shareAchievement(current)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              size="sm"
            >
              <Share2 className="w-3 h-3 mr-2" />
              Compartilhar Conquista
            </Button>
          </div>
          
          {achievements.length > 1 && (
            <div className="flex justify-center gap-1 mt-3">
              {achievements.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-red-600 dark:bg-red-400' : 'bg-red-300 dark:bg-red-600'
                  }`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementNotification;
