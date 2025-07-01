
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import OptimizedMainApp from '@/components/optimized/OptimizedMainApp';
import AuthScreen from '@/components/AuthScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import VideoWelcomeScreen from '@/components/VideoWelcomeScreen';
import TutorialScreen from '@/components/TutorialScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import { performanceMonitor } from '@/utils/optimizedPerformance';

const SimpleIndex = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideoWelcome, setShowVideoWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    performanceMonitor.markStart('auth-check');
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
            
            // Check for first-time user flow
            const hasSeenVideo = localStorage.getItem('sb2_video_watched') === 'true';
            const hasSeenTutorial = localStorage.getItem('sb2_tutorial_completed') === 'true';
            const hasSeenWelcome = localStorage.getItem('sb2_welcome_shown') === 'true';
            
            if (!profileData.onboarding_completed) {
              // User needs onboarding first
            } else if (!hasSeenVideo) {
              setShowVideoWelcome(true);
            } else if (!hasSeenTutorial) {
              setShowTutorial(true);
            } else if (!hasSeenWelcome) {
              setShowWelcome(true);
            }
          }
        }
      } catch (error) {
        // Silently handle auth errors
      } finally {
        setLoading(false);
        performanceMonitor.markEnd('auth-check');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!profile?.onboarding_completed) {
    return <OnboardingScreen />;
  }

  if (showVideoWelcome) {
    return (
      <VideoWelcomeScreen
        onComplete={() => {
          localStorage.setItem('sb2_video_watched', 'true');
          setShowVideoWelcome(false);
          setShowTutorial(true);
        }}
      />
    );
  }

  if (showTutorial) {
    return (
      <TutorialScreen
        onComplete={() => {
          localStorage.setItem('sb2_tutorial_completed', 'true');
          setShowTutorial(false);
          setShowWelcome(true);
        }}
      />
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreen
        onComplete={() => {
          localStorage.setItem('sb2_welcome_shown', 'true');
          setShowWelcome(false);
        }}
      />
    );
  }

  return <OptimizedMainApp />;
};

export default SimpleIndex;
