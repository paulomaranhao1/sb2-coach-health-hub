
import { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFasting } from '@/hooks/useFasting';
import CompactFastingTimer from './fasting/CompactFastingTimer';
import { useAdvancedLogger } from '@/utils/advancedLogger';
import { useIntelligentCache } from '@/utils/intelligentCache';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';

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
  const logger = useAdvancedLogger('MotivationalGreeting');
  const cache = useIntelligentCache();
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

  const setRandomPhrase = useCallback(() => {
    const timer = logger.startTimer('Generate random phrase');
    
    // Usar cache para evitar repetir frases muito recentemente
    const recentPhrases = cache.get<number[]>('temp:recent_phrases') || [];
    const availablePhrases = motivationalPhrases.filter((_, index) => 
      !recentPhrases.includes(index)
    );
    
    const phrasesToUse = availablePhrases.length > 5 ? availablePhrases : motivationalPhrases;
    const randomIndex = Math.floor(Math.random() * phrasesToUse.length);
    const selectedPhrase = phrasesToUse[randomIndex];
    
    setCurrentPhrase(selectedPhrase);
    
    // Atualizar cache de frases recentes
    const originalIndex = motivationalPhrases.indexOf(selectedPhrase);
    const updatedRecent = [...recentPhrases, originalIndex].slice(-10); // Manter últimas 10
    cache.set('temp:recent_phrases', updatedRecent, { ttl: 24 * 60 * 60 * 1000 }); // 24h
    
    timer();
    logger.info('Random phrase generated', { phrase: selectedPhrase });
  }, [cache, logger]);

  const fetchUserName = useCallback(async () => {
    const timer = logger.startTimer('Fetch user name');
    
    try {
      // Verificar cache primeiro
      const cachedName = cache.get<string>('user:name');
      if (cachedName) {
        logger.debug('Using cached user name', { name: cachedName });
        setUserName(cachedName);
        setIsLoading(false);
        timer();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile?.name) {
          setUserName(profile.name);
          // Cache com prioridade alta por 1 hora
          cache.set('user:name', profile.name, { 
            ttl: 60 * 60 * 1000, 
            priority: 'high',
            tags: ['user', 'persist']
          });
          logger.info('User name fetched and cached', { name: profile.name });
        }
      }
    } catch (error) {
      logger.error('Failed to fetch user name', { error });
    } finally {
      setIsLoading(false);
      timer();
    }
  }, [cache, logger]);

  useEffect(() => {
    const timer = logger.startTimer('MotivationalGreeting mount');
    logger.info('MotivationalGreeting mounted');
    
    Promise.all([
      fetchUserName(),
      new Promise(resolve => {
        setRandomPhrase();
        resolve(true);
      })
    ]);
    
    return () => {
      timer();
      logger.info('MotivationalGreeting unmounted');
    };
  }, [fetchUserName, setRandomPhrase, logger]);

  logger.debug('MotivationalGreeting render state', {
    currentFast: !!currentFast,
    isActive,
    timeRemaining,
    fastType: currentFast?.type,
    isLoading,
    userName: !!userName
  });

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
        <div className="glass rounded-2xl p-3 border-0 shadow-lg">
          <EnhancedSkeleton variant="text" lines={2} className="h-4" />
        </div>
      </div>
    );
  }

  // Se não há nome de usuário, não mostrar nada
  if (!userName) return null;

  return (
    <div className="glass rounded-2xl p-3 mb-6 border-0 shadow-lg animate-fade-in">
      <div className="text-left">
        <span className="text-xs text-foreground/80 font-medium leading-tight">
          Olá, {userName}! 👋 {currentPhrase}
        </span>
      </div>
    </div>
  );
});

MotivationalGreeting.displayName = 'MotivationalGreeting';

export default MotivationalGreeting;
