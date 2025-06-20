
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Calendar, Brain, Target, Heart, TrendingUp } from "lucide-react";

const AICoachInfo = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Brain className="w-6 h-6 text-purple-600" />
          🧠 IA Nutricional Avançada
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-300">
          Chat com IA especializada em nutrição e emagrecimento
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status e Prioridade */}
        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-sm">Média Prioridade</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Próximo mês</span>
          </div>
        </div>

        {/* O que você pode esperar */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
            O que você pode esperar:
          </h4>
          
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-black/10 rounded-lg">
              <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Análise nutricional personalizada</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Avaliação completa do seu perfil</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-black/10 rounded-lg">
              <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Planos alimentares inteligentes</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cardápios adaptados ao seu objetivo</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-black/10 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Dicas baseadas no seu perfil</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Orientações personalizadas</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-black/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Integração com dados do SB2 Turbo</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Monitoramento completo</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoachInfo;
