
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageCircle, Target, Zap, Shield, Star } from "lucide-react";

const AICoachInfo = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-red-500" />
          <Zap className="w-6 h-6 text-red-400 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          🤖 Seu AI Coach Pessoal
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Inteligência artificial treinada especificamente para te ajudar no emagrecimento
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <MessageCircle className="w-5 h-5" />
              Chat Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 dark:text-red-200">
              Converse naturalmente sobre suas dúvidas, objetivos e desafios. O AI Coach entende seu contexto e oferece respostas personalizadas.
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Target className="w-5 h-5" />
              Planos Personalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600 dark:text-blue-200">
              Receba planos de treino e alimentação adaptados ao seu perfil, rotina e preferências pessoais.
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Zap className="w-5 h-5" />
              Motivação Diária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600 dark:text-green-200">
              Receba mensagens motivacionais, dicas diárias e lembretes personalizados para manter o foco nos seus objetivos.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Shield className="w-5 h-5" />
              Suporte 24/7
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-600 dark:text-purple-200">
              Disponível a qualquer hora do dia. Tire dúvidas, peça conselhos ou compartilhe suas conquistas quando precisar.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="border-2 border-red-300 dark:border-red-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Star className="w-5 h-5" />
            Por que usar o AI Coach?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
              <Brain className="w-3 h-3 mr-1" />
              Inteligente
            </Badge>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Treinado com milhares de casos de sucesso em emagrecimento
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              <Target className="w-3 h-3 mr-1" />
              Focado
            </Badge>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Especializado em emagrecimento saudável e duradouro
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
              <MessageCircle className="w-3 h-3 mr-1" />
              Acessível
            </Badge>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Sempre disponível, sem agendamentos ou esperas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg p-4 border border-red-200 dark:border-red-800">
        <p className="text-red-700 dark:text-red-300 font-semibold mb-2">
          🚀 Comece sua conversa agora!
        </p>
        <p className="text-red-600 dark:text-red-200 text-sm">
          Digite sua primeira pergunta ou dúvida no chat acima e descubra como o AI Coach pode acelerar seus resultados.
        </p>
      </div>
    </div>
  );
};

export default AICoachInfo;
