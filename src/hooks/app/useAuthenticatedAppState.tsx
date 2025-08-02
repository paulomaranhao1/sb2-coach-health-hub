import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useAuthenticatedAppState = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadUserData = async (userId: string) => {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData);
        setUserStats(statsData || { points: 0, level: 1, shields: [], stickers: [], streak: 0 });
        
        const hasSeenWelcome = localStorage.getItem('sb2_welcome_shown') === 'true';
        const hasSeenTutorial = localStorage.getItem('sb2_tutorial_completed') === 'true';
        
        if (profileData.onboarding_completed && !hasSeenWelcome) {
          setShowWelcome(true);
        } else if (profileData.onboarding_completed && !hasSeenTutorial) {
          setShowTutorial(true);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setUserStats(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    profile,
    userStats,
    loading,
    showWelcome,
    showTutorial,
    setShowWelcome,
    setShowTutorial
  };
};