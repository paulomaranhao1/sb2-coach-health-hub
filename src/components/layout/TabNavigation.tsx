
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageSquare, Camera, Clock, Trophy, Pill, BarChart3, Brain } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "chat", label: "AI Coach", icon: Brain },
    { value: "calorie-counter", label: "Foto Caloria", icon: Camera },
    { value: "intermittent-fasting", label: "Jejum Intermitente", icon: Clock },
    { value: "supplement", label: "Minha Suplementação", icon: Pill },
    { value: "statistics", label: "Estatísticas", icon: BarChart3 },
    { value: "gamification", label: "Conquistas", icon: Trophy }
  ];

  return (
    <>
      {/* Desktop Tabs */}
      <TabsList className="grid w-full grid-cols-7 mb-8 bg-gray-800/90 dark:bg-gray-900/90 border-gray-700 dark:border-gray-600 hidden sm:grid backdrop-blur-sm transition-all duration-500 ease-in-out">
        {tabItems.map((item) => (
          <TabsTrigger 
            key={item.value}
            value={item.value} 
            className={`data-[state=active]:text-white text-gray-300 transition-all duration-300 ease-in-out hover:scale-105 hover:text-white transform-gpu ${
              item.value === 'chat' 
                ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 hover:bg-purple-500/20' 
                : 'data-[state=active]:bg-red-600 hover:bg-red-500/20'
            }`}
          >
            <item.icon className="w-4 h-4 mr-1 transition-transform duration-200 ease-in-out" />
            <span className="transition-all duration-200 ease-in-out">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Mobile Tabs */}
      <div className="sm:hidden mb-8">
        <div className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-700/50 dark:border-gray-600/50 transition-all duration-500 ease-in-out">
          <div className="grid grid-cols-3 gap-2">
            {tabItems.filter(item => item.value !== 'chat').map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ease-in-out transform-gpu ${
                  activeTab === item.value 
                    ? 'bg-red-600 text-white shadow-lg scale-105 shadow-red-500/25' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-102'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-all duration-200 ease-in-out ${
                  activeTab === item.value ? 'animate-bounce' : ''
                }`} />
                <span className="text-xs font-medium text-center leading-tight transition-all duration-200 ease-in-out">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          
          {/* AI Coach Button - Destacado na parte superior */}
          <div className="mt-4 pt-3 border-t border-gray-700/50 transition-all duration-300 ease-in-out">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center justify-center space-x-2 p-4 rounded-xl transition-all duration-400 ease-in-out transform-gpu hover:scale-105 ${
                activeTab === 'chat' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105 animate-pulse' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40'
              }`}
            >
              <MessageSquare className={`w-6 h-6 transition-all duration-300 ease-in-out ${
                activeTab === 'chat' ? 'animate-bounce' : ''
              }`} />
              <span className="font-bold text-lg transition-all duration-200 ease-in-out">AI Coach</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabNavigation;
