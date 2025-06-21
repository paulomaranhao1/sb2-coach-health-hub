
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, ShoppingCart, LogOut } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { supabase } from "@/integrations/supabase/client";

interface MobileMenuSupportSectionProps {
  setShowMobileMenu: (show: boolean) => void;
}

const MobileMenuSupportSection = ({ setShowMobileMenu }: MobileMenuSupportSectionProps) => {
  const handlePurchase = () => {
    const isInBrazil = navigator.language.includes('pt') || 
                      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('America/Sao_Paulo');
    const url = isInBrazil ? 'https://sb2turbo.com.br' : 'https://sb2turbo.com';
    window.open(url, '_blank');
    toastFeedback.info('Redirecionando para a loja...');
  };

  const handleTutorial = () => {
    // Remover a flag do tutorial para que ele apareça novamente
    localStorage.removeItem('sb2_tutorial_completed');
    // Não recarregar a página, apenas mostrar o tutorial diretamente
    setShowMobileMenu(false);
    // Disparar evento personalizado para mostrar o tutorial
    window.dispatchEvent(new CustomEvent('showTutorial'));
    toastFeedback.info('Iniciando tutorial...');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toastFeedback.success('Logout realizado com sucesso!');
    } catch (error) {
      toastFeedback.error('Erro ao fazer logout');
    }
  };

  const handleContact = () => {
    const email = 'contato@sb2coach.ai';
    const subject = 'Contato - SB2coach.ai';
    const body = 'Olá! Gostaria de entrar em contato sobre...';
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.location.href = mailtoLink;
      toastFeedback.info('Abrindo seu cliente de email...');
    } catch (error) {
      // Fallback para copiar email
      navigator.clipboard.writeText(email).then(() => {
        toastFeedback.success(`Email copiado: ${email}`);
      }).catch(() => {
        toastFeedback.info(`Entre em contato: ${email}`);
      });
    }
    setShowMobileMenu(false);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 text-xs uppercase font-semibold px-3">Suporte</h3>
      
      <Button 
        onClick={handleTutorial}
        size="sm" 
        variant="outline" 
        className="w-full justify-start border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Tutorial & Ajuda
      </Button>

      <Button 
        onClick={handleContact}
        size="sm" 
        variant="outline" 
        className="w-full justify-start border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-200"
      >
        <Mail className="w-4 h-4 mr-2" />
        Entrar em Contato
      </Button>
      
      <AnimatedButton 
        onClick={handlePurchase}
        size="sm" 
        className="w-full bg-green-600 hover:bg-green-700 text-white border-0"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Comprar SB2 Turbo
      </AnimatedButton>
      
      <Button 
        onClick={handleLogout}
        size="sm" 
        variant="outline" 
        className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sair
      </Button>
    </div>
  );
};

export default MobileMenuSupportSection;
