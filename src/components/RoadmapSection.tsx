import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Sparkles, Camera, Brain, Target, Trophy, Heart, Zap, Users, BookOpen, Calendar, ShoppingCart, Bell, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  category: 'core' | 'premium' | 'ai' | 'social' | 'analytics';
  icon: any;
  progress?: number;
  estimatedDate?: string;
}

const RoadmapSection = () => {
  const roadmapItems: RoadmapItem[] = [
  // Funcionalidades Concluídas
  {
    id: 'auth',
    title: 'Sistema de Autenticação',
    description: 'Login com email, Google e Magic Links',
    status: 'completed',
    category: 'core',
    icon: CheckCircle2
  }, {
    id: 'daily-habits',
    title: 'Hábitos Diários',
    description: 'Peso, água, SB2 Turbo e primeira refeição',
    status: 'completed',
    category: 'core',
    icon: Target
  }, {
    id: 'gamification',
    title: 'Sistema de Gamificação',
    description: 'Pontos, níveis, escudos e figurinhas',
    status: 'completed',
    category: 'core',
    icon: Trophy
  }, {
    id: 'photo-calorie',
    title: 'Foto Caloria',
    description: 'Contador básico de calorias por fotos',
    status: 'completed',
    category: 'core',
    icon: Camera
  }, {
    id: 'intermittent-fasting',
    title: 'Jejum Intermitente',
    description: '4 planos, timer e estatísticas (Premium)',
    status: 'completed',
    category: 'premium',
    icon: Clock
  }, {
    id: 'ai-coach',
    title: 'AI Coach',
    description: 'Assistente nutricional inteligente (Premium)',
    status: 'completed',
    category: 'ai',
    icon: Brain
  },
  // Em Desenvolvimento
  {
    id: 'advanced-photo-analysis',
    title: 'Análise Avançada de Fotos',
    description: 'IA para reconhecimento automático de alimentos',
    status: 'in-progress',
    category: 'ai',
    icon: Sparkles,
    progress: 75,
    estimatedDate: 'Jan 2025'
  }, {
    id: 'meal-planner',
    title: 'Planejador de Refeições',
    description: 'Sugestões personalizadas baseadas no seu perfil',
    status: 'in-progress',
    category: 'premium',
    icon: Calendar,
    progress: 60,
    estimatedDate: 'Fev 2025'
  },
  // Planejadas
  {
    id: 'social-features',
    title: 'Recursos Sociais',
    description: 'Compartilhamento de conquistas e desafios em grupo',
    status: 'planned',
    category: 'social',
    icon: Users,
    estimatedDate: 'Mar 2025'
  }, {
    id: 'workout-integration',
    title: 'Integração com Exercícios',
    description: 'Treinos personalizados e sincronização com apps fitness',
    status: 'planned',
    category: 'premium',
    icon: Zap,
    estimatedDate: 'Abr 2025'
  }, {
    id: 'advanced-analytics',
    title: 'Analytics Avançado',
    description: 'Relatórios detalhados e insights preditivos',
    status: 'planned',
    category: 'analytics',
    icon: BarChart3,
    estimatedDate: 'Mai 2025'
  }, {
    id: 'nutrition-education',
    title: 'Educação Nutricional',
    description: 'Cursos interativos e certificações',
    status: 'planned',
    category: 'core',
    icon: BookOpen,
    estimatedDate: 'Jun 2025'
  }, {
    id: 'health-monitoring',
    title: 'Monitoramento de Saúde',
    description: 'Integração com dispositivos wearables',
    status: 'planned',
    category: 'premium',
    icon: Heart,
    estimatedDate: 'Jul 2025'
  }, {
    id: 'marketplace',
    title: 'Marketplace SB2',
    description: 'Loja integrada para suplementos e produtos',
    status: 'planned',
    category: 'core',
    icon: ShoppingCart,
    estimatedDate: 'Ago 2025'
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-red-500';
      case 'planned':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em Desenvolvimento';
      case 'planned':
        return 'Planejado';
      default:
        return 'Planejado';
    }
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'premium':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ai':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'social':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'analytics':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'core':
        return 'Core';
      case 'premium':
        return 'Premium';
      case 'ai':
        return 'IA';
      case 'social':
        return 'Social';
      case 'analytics':
        return 'Analytics';
      default:
        return 'Outros';
    }
  };
  const handleVoteFeature = (featureId: string, featureName: string) => {
    toast.success("🗳️ Voto Registrado!", {
      description: `Seu interesse em "${featureName}" foi registrado. Obrigado pelo feedback!`,
      duration: 4000,
    });
  };
  const completedCount = roadmapItems.filter(item => item.status === 'completed').length;
  const totalCount = roadmapItems.length;
  const completionPercentage = Math.round(completedCount / totalCount * 100);
  return <div className="space-y-6">
      {/* Header do Roadmap */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-red-500 mr-2" />
            <CardTitle className="font-bold text-red-600 dark:text-red-400 text-xl py-0 px-[18px]">
              Roadmap SB2coach.ai
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
            Acompanhe o desenvolvimento e próximas funcionalidades
          </CardDescription>
          
          {/* Progresso Geral */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progresso Geral</span>
              <span>{completionPercentage}% Concluído</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {completedCount} de {totalCount} funcionalidades concluídas
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Grid de Funcionalidades */}
      <div className="grid gap-4 md:grid-cols-2">
        {roadmapItems.map(item => {
        const IconComponent = item.icon;
        return <Card key={item.id} className={`transition-all duration-200 hover:shadow-lg ${item.status === 'completed' ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : item.status === 'in-progress' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20' : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.status === 'completed' ? 'bg-green-100 dark:bg-green-900' : item.status === 'in-progress' ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <IconComponent className={`w-5 h-5 ${item.status === 'completed' ? 'text-green-600 dark:text-green-400' : item.status === 'in-progress' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                          {getCategoryName(item.category)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(item.status)} text-white border-0`}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
                
                {item.progress && <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progresso</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>}
                
                <div className="flex items-center justify-between">
                  {item.estimatedDate && <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.estimatedDate}
                    </span>}
                  
                  {item.status === 'planned' && <Button size="sm" variant="outline" onClick={() => handleVoteFeature(item.id, item.title)} className="text-xs hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950">
                      👍 Quero essa!
                    </Button>}
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Rodapé com Call to Action */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6 text-center">
          <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            Sugestões de Funcionalidades
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Tem alguma ideia para o SB2coach.ai? Sua opinião é muito importante!
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" onClick={() => toast.success("💡 Feedback Registrado!", {
            description: "Obrigado por contribuir com o desenvolvimento do SB2coach.ai!",
            duration: 4000,
          })}>
            <Sparkles className="w-4 h-4 mr-2" />
            Enviar Sugestão
          </Button>
        </CardContent>
      </Card>
    </div>;
};
export default RoadmapSection;
