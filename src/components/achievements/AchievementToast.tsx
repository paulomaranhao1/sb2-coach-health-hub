
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Trophy, Shield, Star, Zap } from 'lucide-react';

interface AchievementToastProps {
  achievement: {
    id: string;
    type: 'level' | 'shield' | 'points' | 'streak';
    title: string;
    description: string;
    points?: number;
  };
  show: boolean;
  onClose: () => void;
}

const AchievementToast = ({ achievement, show, onClose }: AchievementToastProps) => {
  useEffect(() => {
    if (show) {
      const getIcon = () => {
        switch (achievement.type) {
          case 'level':
            return <Trophy className="w-6 h-6 text-yellow-500" />;
          case 'shield':
            return <Shield className="w-6 h-6 text-blue-500" />;
          case 'points':
            return <Star className="w-6 h-6 text-purple-500" />;
          case 'streak':
            return <Zap className="w-6 h-6 text-orange-500" />;
          default:
            return <Trophy className="w-6 h-6 text-yellow-500" />;
        }
      };

      toast.success(
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <div className="font-semibold text-sm">{achievement.title}</div>
            <div className="text-xs text-gray-600">{achievement.description}</div>
            {achievement.points && (
              <div className="text-xs text-purple-600 font-medium">
                +{achievement.points} pontos
              </div>
            )}
          </div>
        </div>,
        {
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
            color: '#92400e'
          }
        }
      );

      // Auto close after showing
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  }, [show, achievement, onClose]);

  return null;
};

export default AchievementToast;
