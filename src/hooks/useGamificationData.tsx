
import { mockUserStats } from '@/mocks/userData';

export const useGamificationData = () => {
  // Dados mockados simples - sem complexidade
  const userStats = mockUserStats;
  const loading = false; // Sempre carregado instantaneamente com mocks

  const addPoints = (points: number, message?: string) => {
    console.log(`Adding ${points} points: ${message}`);
    // Mock function - não faz nada real por enquanto
  };

  const dailyPointsClaimed = false; // Sempre pode coletar por enquanto

  return {
    userStats,
    loading,
    addPoints,
    dailyPointsClaimed
  };
};
