
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, Menu, Sun, Moon } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { useState, useEffect } from "react";

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

const Header = ({ theme, toggleTheme, showMobileMenu, setShowMobileMenu }: HeaderProps) => {
  const [pendingReminders, setPendingReminders] = useState(0);

  useEffect(() => {
    // Calcular lembretes pendentes baseado no horário atual
    const now = new Date();
    const currentHour = now.getHours();
    
    let pending = 0;
    
    // Lembrete da manhã (08:00) - pendente se ainda não passou das 8h ou se passou mas ainda é o mesmo dia
    if (currentHour >= 8 && currentHour < 12) {
      pending += 1; // Lembrete da manhã está ativo
    }
    
    // Lembrete da noite (20:00) - pendente se já passou das 20h
    if (currentHour >= 20 || currentHour < 6) {
      pending += 1; // Lembrete da noite está ativo
    }
    
    // Se for antes das 8h, ambos os lembretes do dia estão pendentes
    if (currentHour < 8) {
      pending = 2;
    }
    
    setPendingReminders(pending);
  }, []);

  const handlePurchase = () => {
    const isInBrazil = navigator.language.includes('pt') || 
                      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('America/Sao_Paulo');
    const url = isInBrazil ? 'https://sb2turbo.com.br' : 'https://sb2turbo.com';
    window.open(url, '_blank');
    toastFeedback.info('Redirecionando para a loja...');
  };

  const handleRemindersClick = () => {
    // Scroll para a seção de lembretes ou mostrar um toast
    toastFeedback.info('Verifique seus lembretes de SB2 TURBO na aba Suplementos');
  };

  return (
    <header className="glass border-b border-border/50 backdrop-blur-xl transition-all duration-300 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl bg-transparent border-0 p-0 transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/38b6545e-a016-4e40-860f-139ba93a739c.png" 
                alt="SB2FIT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                SB2FIT
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">Transformação inteligente</p>
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
            {pendingReminders > 0 && (
              <Button
                onClick={handleRemindersClick}
                size="sm"
                variant="secondary"
                className="glass border-0 hidden sm:flex animate-pulse shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Bell className="w-3 h-3 mr-1" />
                {pendingReminders} lembrete{pendingReminders > 1 ? 's' : ''}
              </Button>
            )}
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
