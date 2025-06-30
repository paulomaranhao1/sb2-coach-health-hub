
import OptimizedUserStatsCard from '../optimized/OptimizedUserStatsCard';
import { useOptimizedGamification } from '@/hooks/useOptimizedGamification';

const UserStatsCard = () => {
  const { userStats, loading } = useOptimizedGamification();
  
  return <OptimizedUserStatsCard userStats={userStats} loading={loading} />;
};

export default UserStatsCard;
