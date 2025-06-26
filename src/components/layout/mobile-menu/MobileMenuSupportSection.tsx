import { Button } from "@/components/ui/button";
import { BookOpen, Mail, LogOut, Shield, FileText } from "lucide-react";
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
      className: 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800 bg-white'
    },
    {
      key: 'contact',
      label: 'Entrar em Contato',
      icon: Mail,
      onClick: handleContact,
      className: 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800 bg-white'
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
            className={`w-full justify-start transition-all duration-300 hover:scale-[1.02] hover:shadow-sm border-2 ${item.className}`}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* Seção Legal */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
        <h4 className="text-slate-600 text-xs uppercase font-semibold mb-3 text-center">Documentos Legais</h4>
        
        <div className="space-y-2">
          {legalItems.map((item) => (
            <Button 
              key={item.key}
              onClick={item.onClick}
              size="sm" 
              variant="outline" 
              className="w-full justify-start border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] bg-white"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Botão de Compra Destacado - Com logomarca SB2 */}
      <div className="space-y-2">
        <button
          onClick={handlePurchase}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 border border-red-400/30 hover:from-red-400 hover:to-red-500"
        >
          <div className="p-2 rounded-lg bg-white/20">
            <img 
              src="/lovable-uploads/14136417-1259-434b-aa6a-01fed5a9a6a3.png" 
              alt="SB2 Turbo Logo" 
              className="w-4 h-4 animate-pulse"
            />
          </div>
          <span className="font-bold">Comprar SB2 Turbo</span>
          <div className="ml-auto">
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full animate-bounce">
              OFERTA
            </span>
          </div>
        </button>
      </div>
      
      {/* Botão de Logout */}
      <Button 
        onClick={handleLogout}
        size="sm" 
        variant="outline" 
        className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300 hover:scale-[1.02] bg-white"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Sair
      </Button>
    </div>
  );
};

export default MobileMenuSupportSection;
