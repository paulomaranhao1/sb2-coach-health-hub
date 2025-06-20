
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Lock } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
}

interface AIChatInterfaceProps {
  hasPremiumAccess: boolean;
  onShowOffers: () => void;
}

const AIChatInterface = ({ hasPremiumAccess, onShowOffers }: AIChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Olá! Sou seu AI Coach pessoal. Como posso ajudar você hoje na sua jornada de emagrecimento com o SB2 Turbo?",
      time: "10:00"
    }
  ]);

  const sendMessage = () => {
    if (!hasPremiumAccess) {
      onShowOffers();
      return;
    }

    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
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
  );
};

export default AIChatInterface;
