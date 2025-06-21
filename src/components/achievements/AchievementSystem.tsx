
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AchievementNotification from '../AchievementNotification';
import AchievementHeader from './AchievementHeader';
import AchievementTabs from './AchievementTabs';
import { achievements } from './achievementData';
import { 
  loadUserData, 
  checkAchievementCondition, 
  saveNewAchievements, 
  getLevelProgress,
  UserStats 
} from './achievementLogic';

const AchievementSystem = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    achievements: [],
    totalWeightEntries: 0,
    totalFastingSessions: 0,
    totalCaloriePhotos: 0,
    streak: 0
  });
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    const data = await loadUserData();
    if (data) {
      setUserStats(data);
    }
    setLoading(false);
  };

  const checkAndUnlockAchievements = async () => {
    const newlyUnlocked: any[] = [];
    
    achievements.forEach(achievement => {
      if (userStats.achievements.includes(achievement.id)) return;
      
      const shouldUnlock = checkAchievementCondition(achievement, userStats);
      
      if (shouldUnlock) {
        newlyUnlocked.push({ ...achievement, isUnlocked: true });
      }
    });

    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      const success = await saveNewAchievements(newlyUnlocked, userStats);
      
      if (success) {
        const newAchievementIds = newlyUnlocked.map(a => a.id);
        const totalPoints = newlyUnlocked.reduce((sum, a) => sum + a.points, 0);
        
        setUserStats(prev => ({
          ...prev,
          achievements: [...prev.achievements, ...newAchievementIds],
          points: prev.points + totalPoints
        }));
      }
    }
  };

  const totalAchievements = achievements.length;
  const unlockedAchievements = userStats.achievements.length;
  const completionPercentage = (unlockedAchievements / totalAchievements) * 100;
  const levelProgress = getLevelProgress(userStats);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {newAchievements.length > 0 && (
        <AchievementNotification
          achievements={newAchievements.map(a => ({
            id: a.id,
            type: 'shield',
            name: a.name,
            emoji: a.emoji,
            description: a.description
          }))}
          onClose={() => setNewAchievements([])}
        />
      )}

      <AchievementHeader
        userStats={userStats}
        totalAchievements={totalAchievements}
        unlockedAchievements={unlockedAchievements}
        completionPercentage={completionPercentage}
        levelProgress={levelProgress}
      />

      <AchievementTabs
        achievements={achievements}
        userAchievements={userStats.achievements}
      />

      <Button 
        onClick={checkAndUnlockAchievements} 
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        <Flame className="w-4 h-4 mr-2" />
        Verificar Novas Conquistas
      </Button>
    </div>
  );
};

export default AchievementSystem;
