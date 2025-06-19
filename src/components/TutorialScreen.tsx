
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  Scale, 
  Bell, 
  MessageCircle, 
  Trophy, 
  User,
  CheckCircle,
  X
} from "lucide-react";

interface TutorialScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialScreen = ({ onComplete, onSkip }: TutorialScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      icon: Home,
      title: "Bem-vindo ao SB2 Coach! 🎉",
      description: "Seu companheiro inteligente para emagrecimento saudável",
      content: "Aqui você vai acompanhar sua jornada de transformação com o SB2 TURBO. Vamos te mostrar como usar todas as funcionalidades!",
      highlight: "Tela Inicial",
      color: "bg-gradient-to-r from-red-500 to-red-600"
    },
    {
      icon: Bell,
      title: "Hábitos Diários 📱",
      description: "Controle suas cápsulas SB2 e hidratação",
      content: "Na tela inicial, você encontra os botões para marcar quando tomar as cápsulas (manhã e noite) e acompanhar sua meta diária de água.",
      highlight: "Botões de Cápsulas + Água",
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      icon: Scale,
      title: "Controle de Peso ⚖️",
      description: "Acompanhe sua evolução",
      content: "Registre seu peso regularmente para ver gráficos de progresso e acompanhar sua jornada de emagrecimento.",
      highlight: "Aba 'Peso'",
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      icon: Bell,
      title: "Lembretes Inteligentes 🔔",
      description: "Configure seus horários",
      content: "Na aba 'Suplemento', você pode configurar os horários dos lembretes para nunca esquecer de tomar suas cápsulas.",
      highlight: "Aba 'Suplemento'",
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Chat IA Personalizado 🤖",
      description: "Seu coach pessoal 24/7",
      content: "Converse com nossa IA especializada em emagrecimento! Tire dúvidas, peça dicas personalizadas e receba orientações.",
      highlight: "Aba 'Chat IA'",
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600"
    },
    {
      icon: Trophy,
      title: "Sistema de Conquistas 🏆",
      description: "Gamificação para te motivar",
      content: "Ganhe pontos, desbloqueie escudos e colecione stickers conforme cumpre suas metas diárias!",
      highlight: "Aba 'Conquistas'",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500"
    },
    {
      icon: User,
      title: "Seu Perfil 👤",
      description: "Dados pessoais e configurações",
      content: "Visualize e edite suas informações, acompanhe estatísticas detalhadas e configure preferências do app.",
      highlight: "Aba 'Perfil'",
      color: "bg-gradient-to-r from-pink-500 to-rose-600"
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-fade-in">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
              alt="SB2 Coach Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Indicador de progresso */}
          <div className="flex justify-center space-x-2 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <p className="text-gray-500 text-sm">
            {currentStep + 1} de {tutorialSteps.length}
          </p>

          {/* Botão Skip no canto superior direito */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Pular
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Ícone da funcionalidade */}
          <div className={`w-16 h-16 mx-auto rounded-full ${currentStepData.color} flex items-center justify-center animate-pulse`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Conteúdo do passo */}
          <div className="text-center space-y-4 animate-fade-in">
            <CardTitle className="text-xl font-bold text-gray-900">
              {currentStepData.title}
            </CardTitle>
            
            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-500">
              <p className="text-sm font-semibold text-red-600 mb-1">
                📍 {currentStepData.highlight}
              </p>
              <p className="text-gray-600 text-sm">
                {currentStepData.description}
              </p>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Botões de navegação */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Começar!
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Mensagem motivacional no último passo */}
          {currentStep === tutorialSteps.length - 1 && (
            <div className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-300">
              <div className="text-center">
                <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                  🎯 Você está pronto para começar!
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Sua jornada de transformação com SB2 TURBO começa agora. Estamos aqui para te apoiar em cada passo!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialScreen;
