
import OptimizedGamificationCards from '../optimized/OptimizedGamificationCards';
import { useGamificationData } from '@/hooks/useGamificationData';

const GamificationCards = () => {
  const { userStats, loading } = useGamificationData();
  
  return <OptimizedGamificationCards userStats={userStats} loading={loading} />;
};

export default GamificationCards;
