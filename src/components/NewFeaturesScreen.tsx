
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Utensils, Users, Dumbbell, BarChart3, GraduationCap, Watch, ShoppingBag, Sparkles } from "lucide-react";
import OffersScreen from "./OffersScreen";

interface NewFeaturesScreenProps {
  onBack: () => void;
}

const NewFeaturesScreen = ({ onBack }: NewFeaturesScreenProps) => {
  const [showOffers, setShowOffers] = useState(false);

  const newFeatures = [
    {
      icon: Utensils,
      title: "Planejador de Refeições",
      description: "Planos alimentares personalizados baseados em seus objetivos e preferências",
      benefits: ["Receitas adaptadas ao seu perfil", "Lista de compras automática", "Controle nutricional preciso"]
    },
    {
      icon: Users,
      title: "Recursos Sociais",
      description: "Compartilhe conquistas e participe de desafios em grupo",
      benefits: ["Comunidade motivacional", "Desafios em equipe", "Ranking de conquistas"]
    },
    {
      icon: Dumbbell,
      title: "Treinos Personalizados",
      description: "Sincronização com apps fitness e planos de treino adaptados",
      benefits: ["Integração com apps populares", "Treinos baseados em IA", "Progressão automática"]
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Relatórios detalhados e insights preditivos sobre sua evolução",
      benefits: ["Análises preditivas", "Relatórios personalizados", "Métricas avançadas"]
    },
    {
      icon: GraduationCap,
      title: "Cursos e Certificações",
      description: "Conteúdo educativo interativo com certificações",
      benefits: ["Cursos especializados", "Certificados oficiais", "Aprendizado gamificado"]
    },
    {
      icon: Watch,
      title: "Integração Wearables",
      description: "Conecte dispositivos vestíveis para monitoramento avançado",
      benefits: ["Sincronização automática", "Dados em tempo real", "Múltiplos dispositivos"]
    },
    {
      icon: ShoppingBag,
      title: "Marketplace SB2",
      description: "Marketplace exclusivo com produtos e serviços complementares",
      benefits: ["Produtos exclusivos", "Descontos especiais", "Suplementos verificados"]
    }
  ];

  if (showOffers) {
    return <OffersScreen onBack={() => setShowOffers(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300 mr-3" />
            <h1 className="text-4xl font-bold text-white">
              Novidades SB2coach.ai
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-300 ml-3" />
          </div>
          <p className="text-xl text-red-100 mb-6">
            Descubra as próximas funcionalidades que revolucionarão sua jornada
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <p className="text-white font-semibold">
              🚀 Funcionalidades em desenvolvimento - Em breve disponíveis!
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {newFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  {feature.title}
                </CardTitle>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  EM BREVE
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm text-center">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 text-sm">Benefícios:</h4>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    🔓 Desbloqueie Todas as Funcionalidades
                  </h2>
                  <p className="text-gray-600">
                    Garante acesso prioritário às novas funcionalidades e recursos premium
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-700 mb-3">
                    ⭐ <strong>Acesso Antecipado:</strong> Seja o primeiro a testar as novas funcionalidades
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    🎯 <strong>Recursos Premium:</strong> Todas as funcionalidades avançadas incluídas
                  </p>
                  <p className="text-sm text-gray-700">
                    💎 <strong>Suporte Prioritário:</strong> Atendimento VIP e feedback direto com nossa equipe
                  </p>
                </div>

                <Button 
                  onClick={() => setShowOffers(true)}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Ver Ofertas Exclusivas
                </Button>

                <p className="text-xs text-gray-500">
                  Oferta especial para usuários do app - Descontos limitados!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewFeaturesScreen;
