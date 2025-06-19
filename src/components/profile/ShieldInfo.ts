
export interface Shield {
  name: string;
  emoji: string;
  description: string;
}

export const getShieldInfo = (shieldId: string): Shield => {
  const shields: Record<string, Shield> = {
    'first_weight': { name: 'Primeira Pesagem', emoji: '⚖️', description: 'Registrou o primeiro peso!' },
    'goal_achiever': { name: 'Conquistador', emoji: '🎯', description: 'Está perdendo peso!' },
    'consistent': { name: 'Consistente', emoji: '📈', description: 'Registro por 7 dias seguidos!' },
    'champion': { name: 'Campeão', emoji: '🏆', description: 'Alcançou 30 dias de registro!' },
    'dedicated': { name: 'Dedicado', emoji: '💪', description: 'Atingiu 100 pontos!' }
  };
  return shields[shieldId] || { name: shieldId, emoji: '🛡️', description: 'Escudo conquistado!' };
};
