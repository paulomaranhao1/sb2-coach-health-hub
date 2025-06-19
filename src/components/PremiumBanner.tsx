
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Star, Lock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import OffersScreen from "./OffersScreen";

interface PremiumBannerProps {
  feature: string;
  description: string;
  compact?: boolean;
}

const PremiumBanner = ({ feature, description, compact = false }: PremiumBannerProps) => {
  const { hasPremiumAccess } = useSubscription();
  const [showOffers, setShowOffers] = useState(false);

  if (hasPremiumAccess) {
    return null;
  }

  if (showOffers) {
    return <OffersScreen onBack={() => setShowOffers(false)} />;
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">{feature} - Premium</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowOffers(true)}
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
          >
            Desbloquear
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {feature} (Premium)
            </h3>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                onClick={() => setShowOffers(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                <Star className="w-3 h-3 mr-1" />
                Desbloquear Agora
              </Button>
              <span className="text-xs text-gray-500">
                Clientes SB2 Turbo têm acesso gratuito
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumBanner;
