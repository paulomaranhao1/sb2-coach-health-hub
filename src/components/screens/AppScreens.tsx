
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import TutorialScreen from "@/components/TutorialScreen";
import NewFeaturesScreen from "@/components/NewFeaturesScreen";
import VideoWelcomeScreen from "@/components/VideoWelcomeScreen";
import { Loading } from "@/components/ui/loading";

interface AppScreensProps {
  showVideoWelcome: boolean;
  handleVideoWelcomeComplete: () => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  showOnboarding: boolean;
  showTutorial: boolean;
  showNewFeatures: boolean;
  setShowNewFeatures: (show: boolean) => void;
  isLoading: boolean;
  subscriptionLoading: boolean;
  handleOnboardingComplete: (profileData: any) => void;
  handleTutorialComplete: () => void;
  handleTutorialSkip: () => void;
}

const AppScreens = ({
  showVideoWelcome,
  handleVideoWelcomeComplete,
  showWelcome,
  setShowWelcome,
  showOnboarding,
  showTutorial,
  showNewFeatures,
  setShowNewFeatures,
  isLoading,
  subscriptionLoading,
  handleOnboardingComplete,
  handleTutorialComplete,
  handleTutorialSkip
}: AppScreensProps) => {
  // Prioridade: Video Welcome > Welcome > Onboarding > Tutorial > New Features > Loading
  if (showVideoWelcome) {
    return <VideoWelcomeScreen onVideoComplete={handleVideoWelcomeComplete} />;
  }

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showTutorial) {
    return (
      <TutorialScreen 
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    );
  }

  if (showNewFeatures) {
    return <NewFeaturesScreen onBack={() => setShowNewFeatures(false)} />;
  }

  if (isLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="Carregando SB2coach.ai..." />
      </div>
    );
  }

  return null;
};

export default AppScreens;
