
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Star, Gift, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

interface OffersScreenProps {
  onBack: () => void;
}

const OffersScreen = ({ onBack }: OffersScreenProps) => {
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientCode, setClientCode] = useState("");
  const { updateSubscription } = useSubscription();

  const offers = [
    {
      id: 1,
      title: "SB2 Turbo - Kit Básico",
      originalPrice: 297,
      salePrice: 197,
      discount: "33% OFF",
      features: [
        "1 Frasco SB2 Turbo (60 cápsulas)",
        "Acesso Premium ao App",
        "Chat AI Coach ilimitado",
        "Planos de treino personalizados",
        "Suporte via WhatsApp"
      ],
      link: "https://sb2turbo.com.br/oferta1?app=true&discount=APP33",
      popular: false
    },
    {
      id: 2,
      title: "SB2 Turbo - Kit Completo",
      originalPrice: 594,
      salePrice: 347,
      discount: "42% OFF",
      features: [
        "2 Frascos SB2 Turbo (120 cápsulas)",
        "Acesso Premium ao App por 6 meses",
        "Chat AI Coach ilimitado",
        "Planos de treino + nutrição",
        "Suporte prioritário",
        "E-book exclusivo de receitas"
      ],
      link: "https://sb2turbo.com.br/oferta2?app=true&discount=APP42",
      popular: true
    },
    {
      id: 3,
      title: "SB2 Turbo - Kit Premium",
      originalPrice: 891,
      salePrice: 497,
      discount: "44% OFF",
      features: [
        "3 Frascos SB2 Turbo (180 cápsulas)",
        "Acesso Premium VITALÍCIO",
        "Chat AI Coach ilimitado",
        "Consultoria nutricional 1x1",
        "Suporte VIP 24/7",
        "Todos os e-books e bônus",
        "Grupo VIP no Telegram"
      ],
      link: "https://sb2turbo.com.br/oferta3?app=true&discount=APP44",
      popular: false
    }
  ];

  const handlePurchase = (link: string) => {
    window.open(link, '_blank');
    toast.success('Redirecionando para página de compra...');
  };

  const handleClientVerification = async () => {
    if (!clientCode) {
      toast.error('Digite o código do cliente');
      return;
    }

    if (clientCode.toUpperCase() === 'CLIENTESB2') {
      try {
        await updateSubscription({
          subscription_type: 'client',
          verification_status: 'verified',
          verification_method: 'client_code',
          verification_data: {
            client_code: clientCode
          },
          is_active: true
        });

        toast.success('Acesso premium liberado com sucesso!');
        setShowClientForm(false);
        setClientCode("");
        setTimeout(() => {
          onBack();
        }, 1500);
      } catch (error) {
        toast.error('Erro ao liberar acesso. Tente novamente.');
      }
    } else {
      toast.error('Código inválido. Em breve teremos mais códigos disponíveis.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔥 Ofertas Exclusivas SB2 Turbo
          </h1>
          <p className="text-xl text-red-100 mb-6">
            Acelere sua transformação com desconto especial do app!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
            <p className="text-white font-semibold">
              ⏰ Oferta por tempo limitado - Apenas para usuários do app!
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {offers.map((offer) => (
            <Card key={offer.id} className={`relative ${offer.popular ? 'border-red-400 border-2' : ''}`}>
              {offer.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-400 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  MAIS POPULAR
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{offer.title}</CardTitle>
                <div className="space-y-2">
                  <Badge variant="destructive" className="text-sm">
                    {offer.discount}
                  </Badge>
                  <div>
                    <span className="text-sm text-gray-500 line-through">
                      R$ {offer.originalPrice}
                    </span>
                    <span className="text-2xl font-bold text-green-600 ml-2">
                      R$ {offer.salePrice}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    em até 12x de R$ {Math.ceil(offer.salePrice / 12)}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {offer.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handlePurchase(offer.link)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">🎁 Já é cliente SB2 Turbo?</h3>
              <p className="text-gray-600 mb-4">
                Se você já comprou o SB2 Turbo, pode ter acesso premium gratuito!
              </p>
              
              <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                    <Gift className="w-4 h-4 mr-2" />
                    Já sou cliente - Liberar Premium
                  </Button>
                </DialogTrigger>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Verificação de Cliente</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientCode">Código do Cliente</Label>
                      <Input
                        id="clientCode"
                        placeholder="Digite seu código de cliente"
                        value={clientCode}
                        onChange={(e) => setClientCode(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleClientVerification}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600"
                    >
                      Verificar Código
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">
                        🔜 Em breve: Mais opções de verificação
                      </p>
                      <p className="text-xs text-gray-400">
                        Sistema de verificação automática em desenvolvimento
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OffersScreen;
