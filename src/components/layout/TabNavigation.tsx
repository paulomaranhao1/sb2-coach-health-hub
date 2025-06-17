
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Calendar, Bell, MessageSquare, User, Trophy } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "dashboard", label: "Dashboard", icon: Calendar },
    { value: "weight", label: "Peso", icon: Calendar },
    { value: "supplement", label: "Suplemento", icon: Bell },
    { value: "chat", label: "AI Coach", icon: MessageSquare },
    { value: "gamification", label: "Conquistas", icon: Trophy },
    { value: "profile", label: "Perfil", icon: User }
  ];

  return (
    <>
      {/* Desktop Tabs */}
      <TabsList className="grid w-full grid-cols-7 mb-8 bg-gray-800/90 dark:bg-gray-900/90 border-gray-700 dark:border-gray-600 hidden sm:grid backdrop-blur-sm transition-colors duration-300">
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
            {tabItems.slice(1, 5).map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-200 ${
                  activeTab === item.value 
                    ? 'bg-red-600 text-white shadow-lg transform scale-105' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setActiveTab("gamification")}
              className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-200 ${
                activeTab === "gamification" 
                  ? 'bg-red-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs font-medium text-center leading-tight">Conquistas</span>
            </button>
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-200 ${
                activeTab === "home" 
                  ? 'bg-red-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium text-center leading-tight">Início</span>
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-600">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                activeTab === "profile" 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabNavigation;
