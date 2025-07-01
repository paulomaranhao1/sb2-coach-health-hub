
import { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFasting } from '@/hooks/useFasting';
import CompactFastingTimer from './fasting/CompactFastingTimer';

const motivationalPhrases = [
  "Cada quilograma perdido é uma vitória conquistada! 🎯",
  "Você está mais forte e mais leve a cada dia! 💪",
  "Seus objetivos de peso estão cada vez mais próximos! 🏃‍♀️",
  "Cada passo na balança conta na sua jornada! ⚖️",
  "Sua determinação para emagrecer é inspiradora! ✨",
  "Hoje é o dia perfeito para continuar perdendo peso! 🌟",
  "Sua evolução física é impressionante! 📈",
  "Continue assim, você está emagrecendo! 🔥",
  "Sua dedicação fará toda a diferença na balança! 💯",
  "Cada quilinho a menos é motivo de orgulho! 🏆",
  "Você é capaz de alcançar seu peso ideal! 🎪",
  "Sua transformação corporal está acontecendo! 🦋",
  "Cada dia é uma nova chance de emagrecer! 🌅",
  "Você está no caminho certo para seu peso dos sonhos! 🌈",
  "Sua força de vontade é seu maior aliado! 💎",
  "A cada pesagem, você está mais próximo do objetivo! 🎯",
  "Você está esculpindo o corpo que sempre quis! 🏗️",
  "Cada escolha saudável te leva ao peso ideal! 🥗",
  "Seu comprometimento com a dieta está dando frutos! 🍎",
  "A balança não mente: você está no caminho certo! 📊",
  "Sua jornada de emagrecimento é única e especial! 💫",
  "Cada treino te aproxima do seu peso ideal! 🏋️‍♀️",
  "Você está provando que é possível emagrecer! 🎪",
  "Sua disciplina está transformando seu corpo! 🔄",
  "O peso que você quer está ao seu alcance! 🎯",
  "Cada quilograma perdido é um presente para si mesmo! 🎁",
  "Você está reescrevendo sua história de peso! 📝",
  "Sua determinação está moldando um novo você! 🆕",
  "A cada dia, você fica mais perto do seu peso ideal! 📅",
  "Você é o protagonista da sua transformação! 🌟"
];

const MotivationalGreeting = memo(() => {
  const [userName, setUserName] = useState<string>('');
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    currentFast,
    timeRemaining,
    isActive,
    isPaused,
    stopFast,
    calculateProgress,
    formatTime,
    getFastingPhase
  } = useFasting();

  const setDailyPhrase = useCallback(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const phraseIndex = dayOfYear % motivationalPhrases.length;
    const selectedPhrase = motivationalPhrases[phraseIndex];
    
    setCurrentPhrase(selectedPhrase);
  }, []);

  const fetchUserName = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile?.name) {
          setUserName(profile.name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetchUserName(),
      new Promise(resolve => {
        setDailyPhrase();
        resolve(true);
      })
    ]);
  }, [fetchUserName, setDailyPhrase]);

  // Se há jejum ativo, mostrar apenas o timer compacto
  if (currentFast && timeRemaining > 0 && !currentFast.completed) {
    return (
      <div className="mb-6">
        <CompactFastingTimer 
          currentFast={currentFast}
          timeRemaining={timeRemaining}
          isActive={isActive}
          isPaused={isPaused}
          onPause={() => {}}
          onStop={stopFast}
          formatTime={formatTime}
          calculateProgress={calculateProgress}
          getFastingPhase={getFastingPhase}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-3 border-0">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Se não há nome de usuário, não mostrar nada
  if (!userName) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-3 mb-6 border-0">
      <div className="text-left">
        <span className="text-xs text-blue-800 font-medium leading-tight">
          Olá, {userName}! 👋 {currentPhrase}
        </span>
      </div>
    </div>
  );
});

MotivationalGreeting.displayName = 'MotivationalGreeting';

export default MotivationalGreeting;
