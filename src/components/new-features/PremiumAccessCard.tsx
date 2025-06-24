
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface PremiumAccessCardProps {
  onShowOffers: () => void;
}

const PremiumAccessCard = ({ onShowOffers }: PremiumAccessCardProps) => {
  return (
    <div className="text-center">
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🔓 Desbloqueie Todas as Funcionalidades
              </h2>
              <p className="text-gray-600">
                Garante acesso prioritário às novas funcionalidades e recursos premium
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700 mb-3">
                ⭐ <strong>Acesso Antecipado:</strong> Seja o primeiro a testar as novas funcionalidades
              </p>
              <p className="text-sm text-gray-700 mb-3">
                🎯 <strong>Recursos Premium:</strong> Todas as funcionalidades avançadas incluídas
              </p>
              <p className="text-sm text-gray-700">
                💎 <strong>Suporte Prioritário:</strong> Atendimento VIP e feedback direto com nossa equipe
              </p>
            </div>

            <Button 
              onClick={onShowOffers}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Ver Ofertas Exclusivas
            </Button>

            <p className="text-xs text-white">
              Oferta especial para usuários do app - Descontos limitados!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumAccessCard;
