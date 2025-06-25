
import { ReactNode, useState } from 'react';
import { Home, MessageCircle, Camera, Timer, Trophy, Pill, BarChart3, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModernLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ModernLayout = ({ children, activeTab, onTabChange }: ModernLayoutProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'Início', icon: Home, color: 'text-blue-600' },
    { id: 'chat', label: 'AI Coach', icon: MessageCircle, color: 'text-purple-600', featured: true },
    { id: 'calorie-counter', label: 'Foto', icon: Camera, color: 'text-green-600' },
    { id: 'intermittent-fasting', label: 'Jejum', icon: Timer, color: 'text-orange-600' },
    { id: 'statistics', label: 'Stats', icon: BarChart3, color: 'text-indigo-600' }
  ];

  const secondaryTabs = [
    { id: 'supplement', label: 'Suplementos', icon: Pill },
    { id: 'gamification', label: 'Conquistas', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Moderno */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">SB2coach.ai</h1>
              <p className="text-xs text-slate-500">Sua jornada inteligente</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="relative"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Profile Menu Dropdown */}
        {showProfileMenu && (
          <div className="absolute right-4 top-16 bg-white rounded-xl shadow-lg border border-slate-200 py-2 min-w-[200px] z-50">
            {secondaryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-left"
              >
                <tab.icon className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30">
        <div className="grid grid-cols-5 h-16">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-200",
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all",
                activeTab === tab.id && "bg-blue-100"
              )}>
                <tab.icon className={cn(
                  "w-5 h-5 transition-all",
                  activeTab === tab.id ? "text-blue-600" : "text-slate-600",
                  tab.featured && activeTab !== tab.id && "text-purple-500"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium",
                activeTab === tab.id ? "text-blue-600" : "text-slate-600"
              )}>
                {tab.label}
              </span>
              {tab.featured && activeTab !== tab.id && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Overlay para fechar menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
};

export default ModernLayout;
