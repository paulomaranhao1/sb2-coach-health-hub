
import { CardTitle } from "@/components/ui/card";

interface TutorialStepData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  content: string;
  highlight: string;
  color: string;
}

interface TutorialStepProps {
  stepData: TutorialStepData;
}

const TutorialStep = ({ stepData }: TutorialStepProps) => {
  const Icon = stepData.icon;

  return (
    <div className="space-y-6">
      {/* Ícone da funcionalidade */}
      <div className={`w-16 h-16 mx-auto rounded-full ${stepData.color} flex items-center justify-center animate-pulse`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Conteúdo do passo */}
      <div className="text-center space-y-4 animate-fade-in">
        <CardTitle className="text-xl font-bold text-gray-900">
          {stepData.title}
        </CardTitle>
        
        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-500">
          <p className="text-sm font-semibold text-red-600 mb-1">
            📍 {stepData.highlight}
          </p>
          <p className="text-gray-600 text-sm">
            {stepData.description}
          </p>
        </div>
        
        <p className="text-gray-700 leading-relaxed">
          {stepData.content}
        </p>
      </div>
    </div>
  );
};

export default TutorialStep;
