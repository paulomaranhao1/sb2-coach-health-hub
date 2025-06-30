
import OptimizedUserStatsCard from '../optimized/OptimizedUserStatsCard';
import { useGamificationData } from '@/hooks/useGamificationData';

const UserStatsCard = () => {
  const { userStats, loading } = useGamificationData();
  
  return <OptimizedUserStatsCard userStats={userStats} loading={loading} />;
};

export default UserStatsCard;
