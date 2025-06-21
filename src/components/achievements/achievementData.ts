
export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'weight' | 'fasting' | 'calories' | 'general';
  points: number;
  requirement: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export const achievements: Achievement[] = [
  // Conquistas de Peso
  { id: 'first_weight', name: 'Primeira Pesagem', description: 'Registrou seu primeiro peso', emoji: '⚖️', category: 'weight', points: 50, requirement: 'Registrar peso pela primeira vez', isUnlocked: false },
  { id: 'weight_streak_7', name: 'Semana Consistente', description: '7 dias seguidos registrando peso', emoji: '📈', category: 'weight', points: 100, requirement: '7 dias de streak', isUnlocked: false },
  { id: 'weight_streak_30', name: 'Mestre da Consistência', description: '30 dias seguidos registrando peso', emoji: '🏆', category: 'weight', points: 300, requirement: '30 dias de streak', isUnlocked: false },
  { id: 'weight_streak_90', name: 'Lenda da Disciplina', description: '90 dias seguidos registrando peso', emoji: '👑', category: 'weight', points: 1000, requirement: '90 dias de streak', isUnlocked: false },
  { id: 'weight_loss_1kg', name: 'Primeiro Quilo', description: 'Perdeu 1kg do peso inicial', emoji: '🎯', category: 'weight', points: 150, requirement: 'Perder 1kg', isUnlocked: false },
  { id: 'weight_loss_5kg', name: 'Guerreiro', description: 'Perdeu 5kg do peso inicial', emoji: '⚔️', category: 'weight', points: 500, requirement: 'Perder 5kg', isUnlocked: false },
  { id: 'weight_loss_10kg', name: 'Transformação', description: 'Perdeu 10kg do peso inicial', emoji: '🦋', category: 'weight', points: 1000, requirement: 'Perder 10kg', isUnlocked: false },
  
  // Conquistas de Jejum
  { id: 'first_fast', name: 'Primeiro Jejum', description: 'Completou seu primeiro jejum', emoji: '⏰', category: 'fasting', points: 75, requirement: 'Completar primeiro jejum', isUnlocked: false },
  { id: 'fast_12h', name: 'Disciplinado', description: 'Completou jejum de 12 horas', emoji: '🕐', category: 'fasting', points: 100, requirement: 'Jejum de 12h', isUnlocked: false },
  { id: 'fast_16h', name: 'Determinado', description: 'Completou jejum de 16 horas', emoji: '🔥', category: 'fasting', points: 150, requirement: 'Jejum de 16h', isUnlocked: false },
  { id: 'fast_24h', name: 'Guerreiro do Jejum', description: 'Completou jejum de 24 horas', emoji: '⚡', category: 'fasting', points: 300, requirement: 'Jejum de 24h', isUnlocked: false },
  { id: 'fast_48h', name: 'Mestre do Controle', description: 'Completou jejum de 48 horas', emoji: '🏔️', category: 'fasting', points: 750, requirement: 'Jejum de 48h', isUnlocked: false },
  { id: 'fast_week', name: 'Semana de Jejum', description: '7 jejuns completados', emoji: '🌟', category: 'fasting', points: 250, requirement: '7 jejuns completos', isUnlocked: false },
  { id: 'fast_month', name: 'Mês de Disciplina', description: '30 jejuns completados', emoji: '💎', category: 'fasting', points: 1000, requirement: '30 jejuns completos', isUnlocked: false },
  
  // Conquistas de Calorias
  { id: 'first_photo', name: 'Primeira Análise', description: 'Analisou primeira foto de comida', emoji: '📸', category: 'calories', points: 50, requirement: 'Primeira foto analisada', isUnlocked: false },
  { id: 'photo_streak_7', name: 'Fotógrafo Consistente', description: '7 fotos analisadas em 7 dias', emoji: '📷', category: 'calories', points: 100, requirement: '7 fotos em 7 dias', isUnlocked: false },
  { id: 'photo_streak_30', name: 'Analista Profissional', description: '30 fotos analisadas em 30 dias', emoji: '🔍', category: 'calories', points: 300, requirement: '30 fotos em 30 dias', isUnlocked: false },
  { id: 'calories_tracked_1000', name: 'Contador de Calorias', description: 'Monitorou 1000 calorias', emoji: '🍎', category: 'calories', points: 75, requirement: '1000 calorias monitoradas', isUnlocked: false },
  { id: 'calories_tracked_5000', name: 'Especialista Nutricional', description: 'Monitorou 5000 calorias', emoji: '🥗', category: 'calories', points: 200, requirement: '5000 calorias monitoradas', isUnlocked: false },
  { id: 'calories_tracked_10000', name: 'Nutricionista Expert', description: 'Monitorou 10000 calorias', emoji: '👨‍⚕️', category: 'calories', points: 500, requirement: '10000 calorias monitoradas', isUnlocked: false },
  
  // Conquistas Gerais
  { id: 'points_500', name: 'Colecionador', description: 'Acumulou 500 pontos', emoji: '💎', category: 'general', points: 0, requirement: '500 pontos', isUnlocked: false },
  { id: 'points_1000', name: 'Milionário de Pontos', description: 'Acumulou 1000 pontos', emoji: '💰', category: 'general', points: 0, requirement: '1000 pontos', isUnlocked: false },
  { id: 'points_2500', name: 'Magnata', description: 'Acumulou 2500 pontos', emoji: '🏦', category: 'general', points: 0, requirement: '2500 pontos', isUnlocked: false },
  { id: 'level_5', name: 'Evoluído', description: 'Alcançou nível 5', emoji: '🚀', category: 'general', points: 0, requirement: 'Nível 5', isUnlocked: false },
  { id: 'level_10', name: 'Veterano', description: 'Alcançou nível 10', emoji: '🎖️', category: 'general', points: 0, requirement: 'Nível 10', isUnlocked: false },
  { id: 'level_25', name: 'Lenda', description: 'Alcançou nível 25', emoji: '🏆', category: 'general', points: 0, requirement: 'Nível 25', isUnlocked: false },
  { id: 'completionist', name: 'Completista', description: 'Desbloqueou 10 conquistas', emoji: '🌈', category: 'general', points: 300, requirement: '10 conquistas', isUnlocked: false },
  { id: 'perfectionist', name: 'Perfeccionista', description: 'Desbloqueou 20 conquistas', emoji: '✨', category: 'general', points: 750, requirement: '20 conquistas', isUnlocked: false }
];
