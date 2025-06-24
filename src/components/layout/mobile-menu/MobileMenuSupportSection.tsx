
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, ShoppingCart, LogOut, Shield, FileText } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MobileMenuSupportSectionProps {
  setShowMobileMenu: (show: boolean) => void;
}

const MobileMenuSupportSection = ({ setShowMobileMenu }: MobileMenuSupportSectionProps) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    const isInBrazil = navigator.language.includes('pt') || 
                      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('America/Sao_Paulo');
    const url = isInBrazil ? 'https://sb2turbo.com.br' : 'https://sb2turbo.com';
    window.open(url, '_blank');
    toastFeedback.info('Redirecionando para a loja...');
  };

  const handleTutorial = () => {
    console.log('MobileMenu: Iniciando tutorial...');
    setShowMobileMenu(false);
    
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('showTutorial', 'true');
    
    console.log('MobileMenu: Redirecionando para:', url.toString());
    window.location.href = url.toString();
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
      navigator.clipboard.writeText(email).then(() => {
        toastFeedback.success(`Email copiado: ${email}`);
      }).catch(() => {
        toastFeedback.info(`Entre em contato: ${email}`);
      });
    }
    setShowMobileMenu(false);
  };

  const handlePrivacyPolicy = () => {
    setShowMobileMenu(false);
    navigate('/privacy-policy');
  };

  const handleTermsOfService = () => {
    setShowMobileMenu(false);
    navigate('/terms-of-service');
  };

  const supportItems = [
    {
      key: 'tutorial',
      label: 'Tutorial & Ajuda',
      icon: BookOpen,
      onClick: handleTutorial,
      className: 'border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300'
    },
    {
      key: 'contact',
      label: 'Entrar em Contato',
      icon: Mail,
      onClick: handleContact,
      className: 'border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 hover:text-green-300'
    }
  ];

  const legalItems = [
    {
      key: 'privacy',
      label: 'Política de Privacidade',
      icon: Shield,
      onClick: handlePrivacyPolicy
    },
    {
      key: 'terms',
      label: 'Termos de Uso',
      icon: FileText,
      onClick: handleTermsOfService
    }
  ];

  return (
    <div className="space-y-4">
      {/* Botões de Suporte */}
      <div className="space-y-2">
        {supportItems.map((item) => (
          <Button 
            key={item.key}
            onClick={item.onClick}
            size="sm" 
            variant="outline" 
            className={`w-full justify-start transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border bg-slate-700/50 backdrop-blur-sm ${item.className}`}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* Seção Legal */}
      <div className="bg-slate-700/30 rounded-xl p-3 border border-slate-600/30">
        <h4 className="text-gray-400 text-xs uppercase font-semibold mb-3 text-center">Documentos Legais</h4>
        
        <div className="space-y-2">
          {legalItems.map((item) => (
            <Button 
              key={item.key}
              onClick={item.onClick}
              size="sm" 
              variant="outline" 
              className="w-full justify-start border-slate-500/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-200 hover:border-slate-400 transition-all duration-300 hover:scale-[1.02] bg-slate-800/30"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Botão de Compra Destacado */}
      <AnimatedButton 
        onClick={handlePurchase}
        size="sm" 
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white border-0 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-[1.02]"
      >
        <ShoppingCart className="w-4 h-4 mr-3" />
        <span className="font-semibold">Comprar SB2 Turbo</span>
      </AnimatedButton>
      
      {/* Botão de Logout */}
      <Button 
        onClick={handleLogout}
        size="sm" 
        variant="outline" 
        className="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400 transition-all duration-300 hover:scale-[1.02] bg-slate-700/50"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Sair
      </Button>
    </div>
  );
};

export default MobileMenuSupportSection;
