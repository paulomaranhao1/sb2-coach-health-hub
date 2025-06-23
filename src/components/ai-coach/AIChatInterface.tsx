
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Loader2 } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import { supabase } from "@/integrations/supabase/client";

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
  const [user, setUser] = useState<any>(null);

  // Obter usuário atual
  useState(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  });

  const { messages, sendMessage, isLoading } = useAIChat({
    userId: user?.id,
    hasPremiumAccess: true, // Sempre permitir acesso
    onShowOffers
  });

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      await sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat com IA Nutricional
        </CardTitle>
        <CardDescription>
          Pergunte qualquer coisa sobre nutrição, saúde e emagrecimento
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
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg max-w-xs lg:max-w-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI Coach está pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua pergunta sobre nutrição..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Enviar'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatInterface;
