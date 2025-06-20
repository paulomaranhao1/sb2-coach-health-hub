
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageSquare, Camera, Clock, Trophy, Pill, BarChart3, User } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "calorie-counter", label: "Contador de Calorias", icon: Camera },
    { value: "intermittent-fasting", label: "Jejum Intermitente", icon: Clock },
    { value: "gamification", label: "Conquistas", icon: Trophy },
    { value: "supplement", label: "Minha Suplementação", icon: Pill },
    { value: "statistics", label: "Estatísticas", icon: BarChart3 },
    { value: "profile", label: "Perfil", icon: User },
    { value: "chat", label: "AI Coach", icon: MessageSquare }
  ];

  return (
    <>
      {/* Desktop Tabs */}
      <TabsList className="grid w-full grid-cols-8 mb-8 bg-gray-800/90 dark:bg-gray-900/90 border-gray-700 dark:border-gray-600 hidden sm:grid backdrop-blur-sm transition-colors duration-300">
        {tabItems.map((item) => (
          <TabsTrigger 
            key={item.value}
            value={item.value} 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 transition-all duration-200 hover:scale-105"
          >
            <item.icon className="w-4 h-4 mr-1" />
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Mobile Tabs */}
      <div className="sm:hidden mb-8">
        <div className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-700/50 dark:border-gray-600/50 transition-colors duration-300">
          <div className="grid grid-cols-3 gap-2">
            {tabItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.value 
                    ? 'bg-red-600 text-white shadow-lg transform scale-105' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TabNavigation;
