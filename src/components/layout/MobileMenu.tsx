
import { Button } from "@/components/ui/button";
import { Home, Calendar, Bell, MessageSquare, User, Trophy, ShoppingCart, LogOut, Sun, Moon } from "lucide-react";
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toastFeedback.success('Logout realizado com sucesso!');
    } catch (error) {
      toastFeedback.error('Erro ao fazer logout');
    }
  };

  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "dashboard", label: "Dashboard", icon: Calendar },
    { value: "weight", label: "Peso", icon: Calendar },
    { value: "supplement", label: "Suplemento", icon: Bell },
    { value: "chat", label: "AI Coach", icon: MessageSquare },
    { value: "gamification", label: "Conquistas", icon: Trophy },
    { value: "profile", label: "Perfil", icon: User }
  ];

  if (!showMobileMenu) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 sm:hidden animate-fade-in" 
      onClick={() => setShowMobileMenu(false)}
    >
      <div 
        className="bg-gray-800 dark:bg-gray-900 w-64 h-full shadow-xl animate-slide-in-right transition-colors duration-300" 
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
          {tabItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleTabChange(item.value)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                activeTab === item.value 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-4 border-t border-gray-700 dark:border-gray-600 space-y-2">
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
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
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
