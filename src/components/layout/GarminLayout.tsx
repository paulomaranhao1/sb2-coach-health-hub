
import { ReactNode, useState } from 'react';
import { Home, Target, Calendar, BarChart3, Menu, User, Settings, Trophy, MessageCircle, Camera, Timer, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GarminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const GarminLayout = ({ children, activeTab, onTabChange }: GarminLayoutProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'challenges', label: 'Desafios', icon: Target },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'feed', label: 'Feed', icon: BarChart3 },
    { id: 'more', label: 'Mais', icon: Menu, isMenu: true }
  ];

  const menuItems = [
    { id: 'chat', label: 'AI Coach', icon: MessageCircle, section: 'Funcionalidades' },
    { id: 'calorie-counter', label: 'Contador de Calorias', icon: Camera, section: 'Funcionalidades' },
    { id: 'intermittent-fasting', label: 'Jejum Intermitente', icon: Timer, section: 'Funcionalidades' },
    { id: 'supplement', label: 'Suplementação', icon: Pill, section: 'Funcionalidades' },
    { id: 'gamification', label: 'Conquistas', icon: Trophy, section: 'Gamificação' },
    { id: 'statistics', label: 'Estatísticas', icon: BarChart3, section: 'Análise' },
    { id: 'profile', label: 'Perfil', icon: User, section: 'Conta' },
    { id: 'settings', label: 'Configurações', icon: Settings, section: 'Conta' }
  ];

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const handleTabClick = (tabId: string) => {
    if (tabId === 'more') {
      setShowMenu(true);
    } else {
      onTabChange(tabId);
      setShowMenu(false);
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    onTabChange(itemId);
    setShowMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'rgb(18, 18, 18)' }}>
      {/* Header */}
      <header className="garmin-card flex items-center justify-between p-4 m-4 mb-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary">SB2coach.ai</h1>
            <p className="text-xs text-muted">Sua jornada inteligente</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMenu(true)}
          className="text-secondary hover:text-primary"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-30">
        <div className="grid grid-cols-5 h-16">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "nav-item",
                (activeTab === tab.id || (tab.isMenu && showMenu)) ? "active" : ""
              )}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Side Menu Overlay */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 z-50 overflow-y-auto"
               style={{ backgroundColor: 'rgb(28, 28, 30)' }}>
            
            {/* Menu Header */}
            <div className="p-6 border-b" style={{ borderColor: 'rgb(58, 58, 60)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">Mais</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(false)}
                  className="text-secondary hover:text-primary"
                >
                  ×
                </Button>
              </div>
            </div>

            {/* Menu Content */}
            <div className="p-4">
              {Object.entries(groupedMenuItems).map(([section, items]) => (
                <div key={section} className="mb-6">
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                    {section}
                  </h3>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all",
                        activeTab === item.id
                          ? "bg-blue-600 text-white"
                          : "text-secondary hover:text-primary hover:bg-gray-800"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GarminLayout;
