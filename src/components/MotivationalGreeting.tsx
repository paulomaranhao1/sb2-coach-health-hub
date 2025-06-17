
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MotivationalGreeting = () => {
  const [userName, setUserName] = useState<string>('');
  
  const motivationalPhrases = [
    "Hoje será um grande dia!",
    "Você está mais forte a cada dia!",
    "Seus objetivos estão cada vez mais próximos!",
    "Cada passo conta na sua jornada!",
    "Você é capaz de conquistar tudo!",
    "Sua determinação é inspiradora!",
    "Hoje é o dia perfeito para brilhar!",
    "Sua evolução é impressionante!",
    "Continue assim, você está arrasando!",
    "Sua dedicação fará a diferença!"
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
        
        // Handle the case where name field might not exist yet
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

  if (!userName) return null;

  return (
    <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-3 mb-6">
      <div className="flex items-center justify-center">
        <h2 className="text-lg font-bold text-white mr-2">
          Olá, {userName}! 👋
        </h2>
        <p className="text-red-100 animate-pulse text-sm">
          {currentPhrase}
        </p>
      </div>
    </div>
  );
};

export default MotivationalGreeting;
