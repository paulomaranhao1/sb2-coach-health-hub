
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, Lock, Crown, Star, Brain, Target, Zap, Clock, Heart, TrendingUp } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import OffersScreen from "./OffersScreen";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Olá! Sou seu AI Coach pessoal. Como posso ajudar você hoje na sua jornada de emagrecimento com o SB2 Turbo?",
      time: "10:00"
    }
  ]);
  const [showOffers, setShowOffers] = useState(false);
  const { hasPremiumAccess, subscription, isLoading } = useSubscription();

  const sendMessage = () => {
    if (!hasPremiumAccess) {
      setShowOffers(true);
      return;
    }

    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          text: "Obrigado pela sua pergunta! Vou analisar e fornecer a melhor orientação para seu caso específico. Lembre-se sempre de manter a regularidade no uso do SB2 Turbo para melhores resultados.",
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }, 1000);
    }
  };

  if (showOffers) {
    return <OffersScreen onBack={() => setShowOffers(false)} />;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className={`${hasPremiumAccess ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasPremiumAccess ? (
              <>
                <Crown className="w-5 h-5" />
                AI Coach Premium Ativo
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                🧠 IA Nutricional Avançada Premium
              </>
            )}
          </CardTitle>
          <CardDescription className={hasPremiumAccess ? "text-purple-100" : "text-gray-100"}>
            {hasPremiumAccess 
              ? "Tire suas dúvidas sobre emagrecimento, nutrição e SB2 Turbo" 
              : "IA especializada em nutrição e emagrecimento disponível 24h por dia"
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {!hasPremiumAccess && (
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
                  onClick={() => setShowOffers(true)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  🔥 Adquirir SB2 Turbo + IA Premium
                </Button>
                
                {subscription?.verification_status === 'pending' && (
                  <p className="text-sm text-blue-600 font-medium">
                    ⏳ Verificação em andamento - Acesso será liberado em breve!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className={`h-96 flex flex-col ${!hasPremiumAccess ? 'opacity-50' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat com IA Nutricional
            {!hasPremiumAccess && <Lock className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          <CardDescription>
            {hasPremiumAccess 
              ? "Pergunte qualquer coisa sobre nutrição, saúde e emagrecimento"
              : "IA especializada bloqueada - Adquira o SB2 Turbo para acesso completo"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto mb-4 max-h-64">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder={hasPremiumAccess ? "Digite sua pergunta sobre nutrição..." : "Acesso premium necessário..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
              disabled={!hasPremiumAccess}
            />
            <Button 
              onClick={sendMessage} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!hasPremiumAccess}
            >
              {hasPremiumAccess ? 'Enviar' : <Lock className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasPremiumAccess && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perguntas Populares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Como acelerar o emagrecimento naturalmente?
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Qual o melhor horário para tomar SB2 Turbo?
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Alimentos que potencializam o emagrecimento
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Como manter o peso após emagrecer?
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas Nutricionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">💡 Dica Nutricional</p>
                <p className="text-xs text-blue-700 mt-1">
                  Beba água morna com limão 30 minutos antes do SB2 Turbo para potencializar a absorção
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">🥗 Alimentação</p>
                <p className="text-xs text-green-700 mt-1">
                  Priorize proteínas magras e fibras para manter a saciedade por mais tempo
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-900">⏰ Timing</p>
                <p className="text-xs text-purple-700 mt-1">
                  O melhor momento para exercícios é 1-2 horas após tomar o SB2 Turbo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIChat;
