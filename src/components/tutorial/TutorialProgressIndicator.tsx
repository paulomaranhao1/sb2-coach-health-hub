
interface TutorialProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const TutorialProgressIndicator = ({ currentStep, totalSteps }: TutorialProgressIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index <= currentStep 
              ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110' 
              : 'bg-slate-300 hover:bg-slate-400'
          }`}
        />
      ))}
    </div>
  );
};

export default TutorialProgressIndicator;
