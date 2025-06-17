
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
    <header className="glass border-b border-border/50 backdrop-blur-xl transition-all duration-300 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-transparent to-transparent border-0 p-0.5 transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/315c645a-f0c2-4b01-b17a-e2337aa7a0bd.png" 
                alt="SB2FIT Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                SB2FIT
              </h1>
              <p className="text-sm text-muted-foreground">Transformação inteligente</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={toggleTheme}
              size="sm"
              variant="outline"
              className="glass border-0 hover:scale-105 transition-all duration-200 hidden sm:flex"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <AnimatedButton 
              onClick={handlePurchase}
              size="sm" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 hidden sm:flex shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar SB2 Turbo
            </AnimatedButton>
            <Badge variant="secondary" className="glass border-0 hidden sm:flex animate-pulse shadow-lg">
              <Bell className="w-3 h-3 mr-1" />
              3 lembretes
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="glass border-0 hover:scale-105 transition-all duration-200 sm:hidden"
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
