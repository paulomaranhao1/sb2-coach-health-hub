
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
  );
};

export default MobileMenuNavigation;
