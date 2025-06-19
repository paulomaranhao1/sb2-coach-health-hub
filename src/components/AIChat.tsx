
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, Lock, Crown, Star } from "lucide-react";
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
                <Lock className="w-5 h-5" />
                AI Coach (Premium)
              </>
            )}
          </CardTitle>
          <CardDescription className={hasPremiumAccess ? "text-purple-100" : "text-gray-100"}>
            {hasPremiumAccess 
              ? "Tire suas dúvidas sobre emagrecimento, nutrição e SB2 Turbo" 
              : "Funcionalidade premium - Adquira o SB2 Turbo para desbloquear"
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {!hasPremiumAccess && (
        <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-800">Desbloqueie o AI Coach Premium!</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              O AI Coach é exclusivo para clientes SB2 Turbo. Com ele você tem:
            </p>
            
            <ul className="text-left text-sm text-gray-700 mb-6 space-y-1">
              <li>✅ Chat ilimitado com IA especializada</li>
              <li>✅ Planos personalizados de emagrecimento</li>
              <li>✅ Dicas nutricionais em tempo real</li>
              <li>✅ Suporte 24/7 para suas dúvidas</li>
              <li>✅ Análise de progresso com IA</li>
            </ul>
            
            <div className="space-y-2">
              <Button 
                onClick={() => setShowOffers(true)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                Ver Ofertas SB2 Turbo
              </Button>
              
              {subscription?.verification_status === 'pending' && (
                <p className="text-sm text-blue-600 font-medium">
                  ⏳ Verificação em andamento - Acesso será liberado em breve!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={`h-96 flex flex-col ${!hasPremiumAccess ? 'opacity-50' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat com IA
            {!hasPremiumAccess && <Lock className="w-4 h-4 text-gray-400" />}
          </CardTitle>
          <CardDescription>
            {hasPremiumAccess 
              ? "Pergunte qualquer coisa sobre sua jornada de emagrecimento"
              : "Funcionalidade premium bloqueada"
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
              placeholder={hasPremiumAccess ? "Digite sua pergunta..." : "Premium necessário..."}
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
              <CardTitle className="text-lg">Tópicos Populares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Como acelerar o emagrecimento?
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Posso tomar SB2 com outros medicamentos?
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Quantos quilos posso perder por mês?
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Dicas de alimentação saudável
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">💡 Dica do Dia</p>
                <p className="text-xs text-blue-700 mt-1">
                  Beba água morna com limão pela manhã para potencializar os efeitos do SB2 Turbo
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">🎯 Lembrete</p>
                <p className="text-xs text-green-700 mt-1">
                  Mantenha um deficit calórico saudável de 300-500 calorias por dia
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
