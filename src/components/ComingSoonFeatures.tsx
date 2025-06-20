import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, Clock, Zap, Brain, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ComingSoonFeatures = () => {
  const { toast } = useToast();

  const handleNotifyMe = (featureName: string) => {
    toast({
      title: "🔔 Notificação Ativada!",
      description: `Você será notificado quando ${featureName} estiver disponível!`,
      duration: 3000,
    });
  };

  const upcomingFeatures = [
    {
      id: 1,
      title: "📸 Contador de Calorias por Foto",
      description: "Fotografe sua comida e o SB2 Coach calculará automaticamente as calorias",
      icon: Camera,
      status: "Em Desenvolvimento",
      priority: "high",
      details: [
        "Reconhecimento inteligente de alimentos",
        "Cálculo preciso de calorias e macros",
        "Histórico automático de refeições",
        "Sugestões personalizadas de SB2 Turbo"
      ],
      estimatedLaunch: "Próximas 2 semanas",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "🧠 IA Nutricional Avançada",
      description: "Chat com IA especializada em nutrição e emagrecimento",
      icon: Brain,
      status: "Planejamento",
      priority: "medium",
      details: [
        "Análise nutricional personalizada",
        "Planos alimentares inteligentes",
        "Dicas baseadas no seu perfil",
        "Integração com dados do SB2 Turbo"
      ],
      estimatedLaunch: "Próximo mês",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "🎯 Metas Inteligentes",
      description: "Sistema de metas adaptativas baseado em IA",
      icon: Target,
      status: "Pesquisa",
      priority: "low",
      details: [
        "Metas que se adaptam ao seu progresso",
        "Lembretes personalizados",
        "Gamificação avançada",
        "Recompensas por conquistas"
      ],
      estimatedLaunch: "Em breve",
      color: "from-orange-500 to-red-600"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-white">🔥 Alta Prioridade</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">⚡ Média Prioridade</Badge>;
      case 'low':
        return <Badge className="bg-green-500 text-white">📋 Planejamento</Badge>;
      default:
        return <Badge>Novo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Funcionalidades revolucionárias que estão chegando no SB2 Coach
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6">
        {upcomingFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card 
              key={feature.id} 
              className={`relative overflow-hidden border-2 ${
                feature.priority === 'high' 
                  ? 'border-red-300 bg-gradient-to-r from-red-50 to-purple-50 dark:from-red-950 dark:to-purple-950' 
                  : 'hover:shadow-lg'
              } transition-all duration-300`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-5`} />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                  {getPriorityBadge(feature.priority)}
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                {/* Status and Timeline */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.status === 'Em Desenvolvimento' ? 'bg-blue-500 animate-pulse' :
                      feature.status === 'Planejamento' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <span className="font-medium">{feature.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{feature.estimatedLaunch}</span>
                  </div>
                </div>

                {/* Feature Details */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">O que você pode esperar:</h4>
                  <ul className="space-y-1">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    onClick={() => handleNotifyMe(feature.title)}
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white`}
                  >
                    🔔 Me Avise Quando Estiver Pronto
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ComingSoonFeatures;
