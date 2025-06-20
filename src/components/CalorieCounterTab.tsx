
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CalorieCounterTab = () => {
  const { toast } = useToast();

  const handleNotifyMe = () => {
    toast({
      title: "🔔 Notificação Ativada!",
      description: "Você será notificado quando o Contador de Calorias por Foto estiver disponível!",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8">
        <Camera className="w-20 h-20 mx-auto mb-4 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          📸 Contador de Calorias por Foto
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Revolucione sua alimentação! Tire uma foto da sua refeição e nossa IA calculará automaticamente as calorias e macronutrientes.
        </p>
      </div>

      {/* Main Feature Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                  Funcionalidade em Desenvolvimento
                </CardTitle>
                <p className="text-blue-800 dark:text-blue-200 mt-1">
                  Nossa equipe está trabalhando intensamente para trazer esta revolução até você!
                </p>
              </div>
            </div>
            <Badge className="bg-red-500 text-white">🔥 Alta Prioridade</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status and Timeline */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Em Desenvolvimento Ativo</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Lançamento previsto: Próximas 2 semanas</span>
            </div>
          </div>

          {/* Feature Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">
              O que você poderá fazer:
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Reconhecimento Inteligente</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Nossa IA identifica automaticamente os alimentos na sua foto
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Cálculo Preciso</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Calorias, proteínas, carboidratos e gorduras calculados automaticamente
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Histórico Automático</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Suas refeições são salvas automaticamente para acompanhamento
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Sugestões SB2 Turbo</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Recomendações personalizadas baseadas na sua alimentação
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              onClick={handleNotifyMe}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white text-lg py-3"
            >
              🔔 Me Avise Quando Estiver Pronto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it Works Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Como Funcionará</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold">1. Fotografe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tire uma foto da sua refeição com seu celular
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold">2. IA Analisa</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nossa inteligência artificial identifica e analisa os alimentos
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold">3. Resultados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receba instantaneamente as informações nutricionais completas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalorieCounterTab;
