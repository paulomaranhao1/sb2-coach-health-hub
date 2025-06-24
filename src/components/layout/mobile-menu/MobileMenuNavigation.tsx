
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
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md group ${
            activeTab === item.value 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30' 
              : item.featured
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30 hover:from-indigo-400 hover:to-purple-500'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200 bg-white/50'
          }`}
        >
          <div className={`p-2 rounded-lg ${
            activeTab === item.value 
              ? 'bg-white/20' 
              : item.featured 
              ? 'bg-white/20' 
              : 'bg-slate-100 group-hover:bg-slate-200'
          }`}>
            <item.icon className={`w-4 h-4 ${item.featured ? 'animate-pulse' : ''}`} />
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
