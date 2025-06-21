
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFasting } from '@/hooks/useFasting';
import CompactFastingTimer from './fasting/CompactFastingTimer';

const MotivationalGreeting = () => {
  const [userName, setUserName] = useState<string>('');
  const {
    currentFast,
    timeRemaining,
    isActive,
    isPaused,
    pauseFast,
    calculateProgress,
    formatTime,
    getFastingPhase
  } = useFasting();
  
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

  const [currentPhrase, setCurrentPhrase] = useState('');

  useEffect(() => {
    fetchUserName();
    setRandomPhrase();
  }, []);

  const fetchUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile && (profile as any).name) {
          setUserName((profile as any).name);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar nome do usuário:', error);
    }
  };

  const setRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    setCurrentPhrase(motivationalPhrases[randomIndex]);
  };

  // Se há jejum ativo, mostrar o timer compacto
  if (currentFast && isActive) {
    return (
      <div className="mb-6">
        <CompactFastingTimer 
          currentFast={currentFast}
          timeRemaining={timeRemaining}
          isActive={isActive}
          isPaused={isPaused}
          onPause={pauseFast}
          formatTime={formatTime}
          calculateProgress={calculateProgress}
          getFastingPhase={getFastingPhase}
        />
        {userName && (
          <div className="glass rounded-2xl p-3 border-0 shadow-lg">
            <div className="text-left">
              <span className="text-xs text-foreground/80 font-medium leading-tight">
                Olá, {userName}! 👋 {currentPhrase}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Se não há jejum ativo, mostrar apenas a saudação motivacional
  if (!userName) return null;

  return (
    <div className="glass rounded-2xl p-3 mb-6 border-0 shadow-lg">
      <div className="text-left">
        <span className="text-xs text-foreground/80 font-medium leading-tight">
          Olá, {userName}! 👋 {currentPhrase}
        </span>
      </div>
    </div>
  );
};

export default MotivationalGreeting;
