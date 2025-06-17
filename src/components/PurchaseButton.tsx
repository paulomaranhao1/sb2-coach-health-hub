
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin } from "lucide-react";

interface PurchaseButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const PurchaseButton = ({ 
  variant = "default", 
  size = "default", 
  className = "",
  children
}: PurchaseButtonProps) => {
  const [isInBrazil, setIsInBrazil] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Detectar localização através de múltiplos métodos
        const language = navigator.language;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Verificar se está no Brasil
        const brazilIndicators = [
          language.includes('pt'),
          timezone.includes('America/Sao_Paulo'),
          timezone.includes('America/Bahia'),
          timezone.includes('America/Fortaleza'),
          timezone.includes('America/Recife'),
          timezone.includes('America/Belem')
        ];
        
        const isBrazil = brazilIndicators.some(indicator => indicator);
        setIsInBrazil(isBrazil);
      } catch (error) {
        console.log('Erro ao detectar localização:', error);
        // Fallback para Brasil se houver erro
        setIsInBrazil(true);
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  const handlePurchase = () => {
    const url = isInBrazil ? 'https://sb2turbo.com.br' : 'https://sb2turbo.com';
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        disabled
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Carregando...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handlePurchase}
      variant={variant} 
      size={size} 
      className={className}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {children || 'Comprar SB2 Turbo'}
      <MapPin className="w-3 h-3 ml-1 opacity-70" />
    </Button>
  );
};

export default PurchaseButton;
