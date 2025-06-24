
import { useEffect } from 'react';
import { useUserStats } from './useUserStats';
import { usePointsSystem } from './usePointsSystem';
import { useAchievements } from './useAchievements';

export const useGamification = () => {
  const { userStats, loading, setUserStats, refetch } = useUserStats();
  const { dailyPointsClaimed, setDailyPointsClaimed, addPoints } = usePointsSystem(userStats, setUserStats);
  const { unlockShield, collectSticker } = useAchievements(userStats, setUserStats);

  useEffect(() => {
    // Check if daily points were already claimed
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = userStats.last_activity_date;
    setDailyPointsClaimed(lastActivityDate === today);
  }, [userStats.last_activity_date]);

  return {
    userStats,
    loading,
    dailyPointsClaimed,
    addPoints,
    unlockShield,
    collectSticker,
    refetch
  };
};
