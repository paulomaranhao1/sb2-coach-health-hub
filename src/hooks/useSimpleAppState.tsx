
import { useState, useEffect, useCallback } from 'react';
import { mockUserProfile, mockUserStats, mockSubscription } from '@/mocks/userData';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useSimpleAppState = () => {
  // Estados de autenticação
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados simples com localStorage - removendo video e welcome
  const [showOnboarding, setShowOnboarding] = useState(() => 
    !localStorage.getItem('sb2_onboarding_completed')
  );
  
  const [showTutorial, setShowTutorial] = useState(() => 
    !localStorage.getItem('sb2_tutorial_completed')
  );
  
  const [showNewFeatures, setShowNewFeatures] = useState(() => 
    !localStorage.getItem('sb2_new_features_shown_v2')
  );

  const [isLoading, setIsLoading] = useState(false);

  // Dados mockados - sempre disponíveis instantaneamente
  const userProfile = mockUserProfile;
  const userStats = mockUserStats;
  const subscription = mockSubscription;

  // Verificar autenticação
  useEffect(() => {
    // Configurar listener de auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        setSession(session);
        setLoading(false);
      }
    );

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', !!session);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!session;

  // Handlers simples - removendo video e welcome handlers
  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('sb2_onboarding_completed', 'true');
    setShowOnboarding(false);
    setShowTutorial(true);
  }, []);

  const handleTutorialComplete = useCallback(() => {
    localStorage.setItem('sb2_tutorial_completed', 'true');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleTutorialSkip = useCallback(() => {
    localStorage.setItem('sb2_tutorial_completed', 'true');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleNewFeaturesComplete = useCallback(() => {
    localStorage.setItem('sb2_new_features_shown_v2', 'true');
    setShowNewFeatures(false);
  }, []);

  return {
    // Estados - removendo showVideoWelcome e showWelcome
    showOnboarding,
    showTutorial,
    showNewFeatures,
    isLoading: loading || isLoading,
    isAuthenticated,
    session,
    
    // Dados
    userProfile,
    userStats,
    subscription,
    
    // Handlers - removendo handlers de video e welcome
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleNewFeaturesComplete,
    
    // Funções de controle simples
    setShowNewFeatures
  };
};
