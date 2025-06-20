
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, Heart, Clock, TrendingUp, Zap, Star } from "lucide-react";

interface AIFeaturesListProps {
  onShowOffers: () => void;
  subscriptionStatus?: string;
}

const AIFeaturesList = ({ onShowOffers, subscriptionStatus }: AIFeaturesListProps) => {
  return (
    <>
      {/* Recursos Avançados da IA */}
      <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-blue-600" />
            🧠 IA Nutricional Revolucionária
          </CardTitle>
          <CardDescription className="text-base">
            Sistema inteligente que combina ciência nutricional com dados do SB2 Turbo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recursos Principais */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                Análise Nutricional Personalizada
              </h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Avaliação completa do seu perfil nutricional
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Recomendações baseadas no seu metabolismo
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Dicas específicas para potencializar o SB2 Turbo
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Planos Alimentares Inteligentes
              </h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Cardápios adaptados ao seu objetivo
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Receitas que aceleram o emagrecimento
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Sugestões de acordo com suas preferências
                </li>
              </ul>
            </div>
          </div>

          {/* Funcionalidades 24h */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-teal-500" />
              Suporte 24 Horas por Dia
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                Dúvidas sobre alimentação em tempo real
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                Orientações sobre uso do SB2 Turbo
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                Motivação e acompanhamento diário
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                Análise de progresso inteligente
              </div>
            </div>
          </div>

          {/* Integração com SB2 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Integração Total com SB2 Turbo
            </h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                Monitoramento dos efeitos do suplemento no seu organismo
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                Otimização dos horários de consumo
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-3 h-3 text-yellow-500" />
                Combinações alimentares que potencializam resultados
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-800">Desbloqueie a IA Nutricional Completa!</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            A IA Nutricional Avançada é exclusiva para clientes SB2 Turbo. Tenha acesso a:
          </p>
          
          <ul className="text-left text-sm text-gray-700 mb-6 space-y-1">
            <li>🧠 IA especializada em nutrição e emagrecimento</li>
            <li>⏰ Suporte nutricional 24 horas por dia</li>
            <li>🎯 Planos alimentares personalizados</li>
            <li>💊 Orientações específicas sobre SB2 Turbo</li>
            <li>📊 Análise inteligente do seu progresso</li>
            <li>🍽️ Receitas que aceleram o emagrecimento</li>
            <li>💬 Chat ilimitado com especialista virtual</li>
          </ul>
          
          <div className="space-y-2">
            <Button 
              onClick={onShowOffers}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              🔥 Adquirir SB2 Turbo + IA Premium
            </Button>
            
            {subscriptionStatus === 'pending' && (
              <p className="text-sm text-blue-600 font-medium">
                ⏳ Verificação em andamento - Acesso será liberado em breve!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AIFeaturesList;
