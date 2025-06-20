
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Brain } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import OffersScreen from "./OffersScreen";
import AIFeaturesList from "./ai-coach/AIFeaturesList";
import AIChatInterface from "./ai-coach/AIChatInterface";
import AIQuickActions from "./ai-coach/AIQuickActions";

const AIChat = () => {
  const [showOffers, setShowOffers] = useState(false);
  const { hasPremiumAccess, subscription, isLoading } = useSubscription();

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
        <AIFeaturesList 
          onShowOffers={() => setShowOffers(true)}
          subscriptionStatus={subscription?.verification_status}
        />
      )}

      <AIChatInterface 
        hasPremiumAccess={hasPremiumAccess}
        onShowOffers={() => setShowOffers(true)}
      />

      {hasPremiumAccess && <AIQuickActions />}
    </div>
  );
};

export default AIChat;
