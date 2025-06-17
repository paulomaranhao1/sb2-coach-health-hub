
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, Menu, Sun, Moon } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toastFeedback } from "@/components/ui/toast-feedback";

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

const Header = ({ theme, toggleTheme, showMobileMenu, setShowMobileMenu }: HeaderProps) => {
  const handlePurchase = () => {
    const isInBrazil = navigator.language.includes('pt') || 
                      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('America/Sao_Paulo');
    const url = isInBrazil ? 'https://sb2turbo.com.br' : 'https://sb2turbo.com';
    window.open(url, '_blank');
    toastFeedback.info('Redirecionando para a loja...');
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-500 dark:from-red-700 dark:to-red-600 shadow-lg border-b border-red-400 dark:border-red-500 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-white p-1 transform hover:scale-105 transition-transform duration-200">
              <img 
                src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
                alt="SB2FIT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SB2FIT</h1>
              <p className="text-sm text-red-100 dark:text-red-200">Seu companheiro de emagrecimento</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleTheme}
              size="sm"
              variant="outline"
              className="border-red-200 text-white hover:bg-red-700 bg-red-600/30 backdrop-blur-sm hidden sm:flex transition-all duration-200"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <AnimatedButton 
              onClick={handlePurchase}
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white border-0 hidden sm:flex"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar SB2 Turbo
            </AnimatedButton>
            <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 hidden sm:flex dark:bg-red-900 dark:text-red-200 dark:border-red-800 animate-pulse">
              <Bell className="w-3 h-3 mr-1" />
              3 lembretes ativos
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-white hover:bg-red-700 bg-red-600/30 backdrop-blur-sm sm:hidden transition-all duration-200"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
