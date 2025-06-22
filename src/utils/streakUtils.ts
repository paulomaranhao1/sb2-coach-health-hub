
export const calculateStreak = (entries: any[]) => {
  if (!entries || entries.length === 0) return 0;
  
  // Implementação básica de cálculo de streak
  let streak = 0;
  const today = new Date();
  
  // Ordenar por data decrescente
  const sortedEntries = entries.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  // Calcular streak consecutivo
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].created_at);
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === i) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
