
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, Menu, Sun, Moon, Crown } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toastFeedback } from "@/components/ui/toast-feedback";
import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import OffersScreen from "../OffersScreen";
import RemindersModal from "../RemindersModal";

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}

const Header = ({ theme, toggleTheme, showMobileMenu, setShowMobileMenu }: HeaderProps) => {
  const [pendingReminders, setPendingReminders] = useState(0);
  const [showOffers, setShowOffers] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const { hasPremiumAccess, subscription } = useSubscription();
  
  // Check if reminders are enabled
  const remindersEnabled = localStorage.getItem('sb2_reminders_enabled') !== 'false';
  const visualAlertEnabled = localStorage.getItem('sb2_visual_alert') !== 'false';

  useEffect(() => {
    if (!remindersEnabled) {
      setPendingReminders(0);
      return;
    }

    const calculatePendingReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const today = new Date().toDateString();
      
      // Get taken reminders for today
      const takenReminders = JSON.parse(localStorage.getItem('sb2_taken_reminders') || '{}');
      const todayTaken = takenReminders[today] || [];
      
      let pending = 0;
      
      // Morning reminder (08:00) - pending if it's after 8am and not taken
      if (currentHour >= 8 && currentHour < 12 && !todayTaken.includes('morning')) {
        pending += 1;
      }
      
      // Evening reminder (20:00) - pending if it's after 8pm and not taken
      if (currentHour >= 20 && !todayTaken.includes('evening')) {
        pending += 1;
      }
      
      // If before 8am, both reminders are potentially pending (but check if taken yesterday)
      if (currentHour < 8) {
        if (!todayTaken.includes('morning')) pending += 1;
        if (!todayTaken.includes('evening')) pending += 1;
      }
      
      setPendingReminders(pending);
    };

    calculatePendingReminders();
    
    // Update every minute
    const interval = setInterval(calculatePendingReminders, 60000);
    
    return () => clearInterval(interval);
  }, [remindersEnabled]);

  const handlePurchase = () => {
    setShowOffers(true);
  };

  const handleRemindersClick = () => {
    if (pendingReminders > 0) {
      setShowRemindersModal(true);
    } else {
      toastFeedback.info('Nenhum lembrete pendente no momento');
    }
  };

  const handleNavigateToSupplements = () => {
    // Trigger navigation to supplements tab
    window.dispatchEvent(new CustomEvent('navigateToSupplements'));
  };

  if (showOffers) {
    return <OffersScreen onBack={() => setShowOffers(false)} />;
  }

  return (
    <>
      <header className="glass border-b border-border/50 backdrop-blur-xl transition-all duration-300 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-white p-1 flex-shrink-0">
                <img 
                  src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
                  alt="SB2coach.ai Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
                  SB2coach.ai
                </h1>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1">
                  {hasPremiumAccess ? (
                    <>
                      <Crown className="w-3 h-3 text-yellow-500" />
                      Premium Ativo
                    </>
                  ) : (
                    "Transformação inteligente"
                  )}
                </p>
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
              
              {!hasPremiumAccess && (
                <AnimatedButton 
                  onClick={handlePurchase}
                  size="sm" 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 hidden sm:flex shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar SB2 Turbo
                </AnimatedButton>
              )}
              
              {subscription?.verification_status === 'pending' && (
                <Badge variant="secondary" className="hidden sm:flex animate-pulse">
                  Verificando...
                </Badge>
              )}
              
              {remindersEnabled && pendingReminders > 0 && (
                <Button
                  onClick={handleRemindersClick}
                  size="sm"
                  variant="secondary"
                  className={`glass border-0 hidden sm:flex shadow-lg hover:scale-105 transition-all duration-200 text-slate-800 dark:text-slate-200 ${
                    visualAlertEnabled ? 'animate-pulse' : ''
                  }`}
                >
                  <Bell className="w-3 h-3 mr-1" />
                  {pendingReminders} lembrete{pendingReminders > 1 ? 's' : ''}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="glass border-0 hover:scale-105 transition-all duration-200"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <RemindersModal 
        open={showRemindersModal}
        onOpenChange={setShowRemindersModal}
        onNavigateToSupplements={handleNavigateToSupplements}
      />
    </>
  );
};

export default Header;
