
import OptimizedMainApp from '@/components/optimized/OptimizedMainApp';
import AuthScreen from '@/components/AuthScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import TutorialScreen from '@/components/TutorialScreen';
import ModernWelcomeScreen from '@/components/welcome/ModernWelcomeScreen';
import { useAuthenticatedAppState } from '@/hooks/app/useAuthenticatedAppState';

const SimpleIndex = () => {
  const {
    user,
    profile,
    loading,
    showWelcome,
    showTutorial,
    setShowWelcome,
    setShowTutorial
  } = useAuthenticatedAppState();

  const handleOnboardingComplete = () => {
    window.location.reload();
  };

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
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showWelcome) {
    return (
      <ModernWelcomeScreen
        onContinue={() => {
          localStorage.setItem('sb2_welcome_shown', 'true');
          setShowWelcome(false);
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
        }}
        onSkip={() => {
          localStorage.setItem('sb2_tutorial_completed', 'true');
          setShowTutorial(false);
        }}
      />
    );
  }

  return <OptimizedMainApp />;
};

export default SimpleIndex;
