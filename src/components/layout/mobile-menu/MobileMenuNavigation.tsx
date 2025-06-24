
import { Home, MessageSquare, Camera, Clock, Trophy, Pill, BarChart3 } from "lucide-react";

interface MobileMenuNavigationProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
}

const MobileMenuNavigation = ({ activeTab, handleTabChange }: MobileMenuNavigationProps) => {
  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "chat", label: "AI Coach", icon: MessageSquare, featured: true },
    { value: "calorie-counter", label: "Foto Caloria", icon: Camera },
    { value: "intermittent-fasting", label: "Jejum Intermitente", icon: Clock },
    { value: "supplement", label: "Minha Suplementação", icon: Pill },
    { value: "statistics", label: "Estatísticas", icon: BarChart3 },
    { value: "gamification", label: "Conquistas", icon: Trophy }
  ];

  return (
    <div className="space-y-2">
      {tabItems.map((item) => (
        <button
          key={item.value}
          onClick={() => handleTabChange(item.value)}
          className={`mobile-menu-item w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md group ${
            activeTab === item.value ? 'active' : ''
          }`}
        >
          <div className={`mobile-menu-icon p-2 rounded-lg ${
            item.featured ? 'animate-pulse' : ''
          }`}>
            <item.icon className="w-4 h-4" />
          </div>
          <span className={`font-medium ${item.featured ? 'font-bold' : ''}`}>
            {item.label}
          </span>
          {item.featured && (
            <div className="ml-auto">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                ✨
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default MobileMenuNavigation;
