
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, Bell } from "lucide-react";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Olá! Sou seu AI Coach pessoal. Como posso ajudar você hoje na sua jornada de emagrecimento com o SB2 Turbo?",
      time: "10:00"
    },
    {
      id: 2,
      sender: "user",
      text: "Olá! Tenho uma dúvida sobre o horário ideal para tomar o suplemento.",
      time: "10:05"
    },
    {
      id: 3,
      sender: "ai",
      text: "Ótima pergunta! O SB2 Turbo funciona melhor quando tomado 30 minutos antes das refeições principais. Recomendo 1 cápsula pela manhã (antes do café) e 1 à noite (antes do jantar). Isso otimiza a absorção e acelera o metabolismo. Você está seguindo essa rotina?",
      time: "10:06"
    }
  ]);

  const sendMessage = () => {
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

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Coach Personalizado
          </CardTitle>
          <CardDescription className="text-purple-100">
            Tire suas dúvidas sobre emagrecimento, nutrição e SB2 Turbo
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="h-96 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat com IA</CardTitle>
          <CardDescription>
            Pergunte qualquer coisa sobre sua jornada de emagrecimento
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
              placeholder="Digite sua pergunta..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700">
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default AIChat;
