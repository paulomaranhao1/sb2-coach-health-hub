
interface OnboardingProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgressIndicator = ({ currentStep, totalSteps }: OnboardingProgressIndicatorProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step <= currentStep 
                ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
      <p className="text-gray-400 text-sm mt-2">
        Passo {currentStep} de {totalSteps}
      </p>
    </div>
  );
};

export default OnboardingProgressIndicator;
