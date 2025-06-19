
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
    'dedicated': { name: 'Dedicado', emoji: '💪', description: 'Atingiu 100 pontos!' },
    'warrior': { name: 'Guerreiro', emoji: '⚔️', description: 'Perdeu 5kg!' },
    'persistent': { name: 'Persistente', emoji: '🔥', description: 'Registro por 15 dias seguidos!' },
    'transformer': { name: 'Transformador', emoji: '🦋', description: 'Perdeu 10kg!' },
    'disciplined': { name: 'Disciplinado', emoji: '🎖️', description: 'Atingiu 500 pontos!' },
    'legend': { name: 'Lenda', emoji: '👑', description: 'Registro por 100 dias seguidos!' },
    'master': { name: 'Mestre', emoji: '🧙‍♂️', description: 'Atingiu 1000 pontos!' },
    'phoenix': { name: 'Fênix', emoji: '🔥', description: 'Perdeu 15kg!' },
    'titan': { name: 'Titã', emoji: '⚡', description: 'Perdeu 20kg!' },
    'immortal': { name: 'Imortal', emoji: '💎', description: 'Registro por 365 dias!' }
  };
  return shields[shieldId] || { name: shieldId, emoji: '🛡️', description: 'Escudo conquistado!' };
};
