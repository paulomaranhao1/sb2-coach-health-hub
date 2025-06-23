
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import { supabase } from "@/integrations/supabase/client";
import OffersScreen from "./OffersScreen";
import AICoachInfo from "./ai-coach/AICoachInfo";
import AIChatInterface from "./ai-coach/AIChatInterface";
import AIQuickActions from "./ai-coach/AIQuickActions";

const AIChat = () => {
  const [showOffers, setShowOffers] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Obter usuário atual
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const { messages, sendMessage, isLoading } = useAIChat({
    userId: user?.id,
    hasPremiumAccess: true, // Sempre permitir acesso
    onShowOffers: () => setShowOffers(true)
  });

  if (showOffers) {
    return <OffersScreen onBack={() => setShowOffers(false)} />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            🧠 IA Nutricional Avançada
          </CardTitle>
          <CardDescription className="text-blue-100">
            Tire suas dúvidas sobre emagrecimento, nutrição e SB2 Turbo
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Informações detalhadas sobre a IA */}
      <AICoachInfo />

      <AIChatInterface 
        messages={messages}
        sendMessage={sendMessage}
        isLoading={isLoading}
        hasPremiumAccess={true} // Sempre permitir acesso
        onShowOffers={() => setShowOffers(true)}
      />

      <AIQuickActions onSendMessage={sendMessage} />
    </div>
  );
};

export default AIChat;
