
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import TutorialScreen from "@/components/TutorialScreen";
import NewFeaturesScreen from "@/components/NewFeaturesScreen";
import { Loading } from "@/components/ui/loading";

interface AppScreensProps {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  showOnboarding: boolean;
  showTutorial: boolean;
  showNewFeatures: boolean;
  setShowNewFeatures: (show: boolean) => void;
  isLoading: boolean;
  subscriptionLoading: boolean;
  handleOnboardingComplete: () => void;
  handleTutorialComplete: () => void;
  handleTutorialSkip: () => void;
}

const AppScreens = ({
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
