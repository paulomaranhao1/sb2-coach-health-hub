
import OptimizedGamificationCards from '../optimized/OptimizedGamificationCards';
import { useOptimizedGamification } from '@/hooks/useOptimizedGamification';

const GamificationCards = () => {
  const { userStats, loading } = useOptimizedGamification();
  
  return <OptimizedGamificationCards userStats={userStats} loading={loading} />;
};

export default GamificationCards;
