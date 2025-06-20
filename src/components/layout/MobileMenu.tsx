
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Camera, Clock, Trophy, Pill, ShoppingCart, LogOut, Sun, Moon, BookOpen, BarChart3, User, Settings, Mail } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { supabase } from "@/integrations/supabase/client";

interface MobileMenuProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  activeTab: string;
  handleTabChange: (value: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const MobileMenu = ({ 
  showMobileMenu, 
  setShowMobileMenu, 
  activeTab, 
  handleTabChange, 
  theme, 
  toggleTheme 
}: MobileMenuProps) => {
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

  const handleProfileClick = () => {
    handleTabChange('profile');
    setShowMobileMenu(false);
  };

  const handleSettingsClick = () => {
    handleTabChange('settings');
    setShowMobileMenu(false);
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

  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "chat", label: "AI Coach", icon: MessageSquare, featured: true },
    { value: "calorie-counter", label: "Foto Caloria", icon: Camera },
    { value: "intermittent-fasting", label: "Jejum Intermitente", icon: Clock },
    { value: "gamification", label: "Conquistas", icon: Trophy },
    { value: "supplement", label: "Minha Suplementação", icon: Pill },
    { value: "statistics", label: "Estatísticas", icon: BarChart3 }
  ];

  if (!showMobileMenu) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 animate-fade-in" 
      onClick={() => setShowMobileMenu(false)}
    >
      <div 
        className="bg-gray-800 dark:bg-gray-900 w-64 h-full shadow-xl animate-slide-in-right transition-colors duration-300 overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Menu</h2>
            <Button
              onClick={toggleTheme}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {/* Menu Principal */}
          <div className="space-y-2">
            {tabItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                  activeTab === item.value 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : item.featured
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.featured ? 'animate-pulse' : ''}`} />
                <span className={item.featured ? 'font-bold' : ''}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="border-t border-gray-700 dark:border-gray-600 my-4"></div>

          {/* Seção de Usuário */}
          <div className="space-y-2">
            <h3 className="text-gray-400 text-xs uppercase font-semibold px-3">Usuário</h3>
            
            <button
              onClick={handleProfileClick}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'profile' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </button>

            <button
              onClick={handleSettingsClick}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'settings' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </button>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-700 dark:border-gray-600 my-4"></div>

          {/* Seção de Suporte */}
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
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
