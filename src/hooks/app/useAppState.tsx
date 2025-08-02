import { useState, useEffect, useCallback } from 'react';
import { mockUserProfile, mockUserStats, mockSubscription } from '@/mocks/userData';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useAppState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => 
    !localStorage.getItem('sb2_onboarding_completed')
  );
  
  // Mock data - simplified
  const mockUserData = {
    userProfile: mockUserProfile,
    userStats: mockUserStats,
    subscription: mockSubscription
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('sb2_onboarding_completed', 'true');
    setShowOnboarding(false);
  }, []);

  return {
    session,
    loading,
    showOnboarding,
    completeOnboarding,
    ...mockUserData,
    isLoggedIn: !!session
  };
};