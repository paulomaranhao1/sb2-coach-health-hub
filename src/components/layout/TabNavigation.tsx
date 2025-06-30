
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageSquare, Camera, Clock, Trophy, Pill, BarChart3, User, Settings } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  const mainTabs = [
    { value: "home", label: "Início", icon: Home },
    { value: "chat", label: "AI Coach", icon: MessageSquare },
    { value: "calorie-counter", label: "Calorias", icon: Camera },
    { value: "intermittent-fasting", label: "Jejum", icon: Clock },
    { value: "supplement", label: "Suplementos", icon: Pill },
    { value: "statistics", label: "Stats", icon: BarChart3 },
    { value: "gamification", label: "Conquistas", icon: Trophy }
  ];

  const secondaryTabs = [
    { value: "profile", label: "Perfil", icon: User },
    { value: "settings", label: "Config", icon: Settings }
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Mobile Navigation - Simplified */}
      <div className="md:hidden">
        {/* Main Tabs - Grid Layout */}
        <div className="p-3">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {mainTabs.slice(0, 4).map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.value 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {mainTabs.slice(4).map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.value 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Secondary Tabs */}
          <div className="flex justify-center gap-2">
            {secondaryTabs.map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === item.value 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Horizontal Tabs */}
      <div className="hidden md:block">
        <TabsList className="w-full justify-start bg-white border-none">
          {[...mainTabs, ...secondaryTabs].map((item) => (
            <TabsTrigger 
              key={item.value}
              value={item.value}
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  );
};

export default TabNavigation;
