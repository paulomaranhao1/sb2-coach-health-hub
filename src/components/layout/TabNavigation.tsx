
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageSquare, Camera, Clock, Trophy, Pill, BarChart3, User, Zap, Calendar } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "chat", label: "AI Coach", icon: MessageSquare, featured: true },
    { value: "calorie-counter", label: "Contador de Calorias", icon: Camera },
    { value: "intermittent-fasting", label: "Jejum Intermitente", icon: Clock },
    { value: "gamification", label: "Conquistas", icon: Trophy },
    { value: "supplement", label: "Minha Suplementação", icon: Pill },
    { value: "statistics", label: "Estatísticas", icon: BarChart3 },
    { value: "profile", label: "Perfil", icon: User }
  ];

  return (
    <>
      {/* Desktop Tabs */}
      <TabsList className="grid w-full grid-cols-8 mb-8 bg-gray-800/90 dark:bg-gray-900/90 border-gray-700 dark:border-gray-600 hidden sm:grid backdrop-blur-sm transition-colors duration-300">
        {tabItems.map((item) => (
          <TabsTrigger 
            key={item.value}
            value={item.value} 
            className={`data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 transition-all duration-200 hover:scale-105 ${
              item.featured ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold border-2 border-purple-400 shadow-lg hover:shadow-purple-500/30' : ''
            }`}
          >
            <item.icon className={`w-4 h-4 mr-1 ${item.featured ? 'animate-pulse' : ''}`} />
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Mobile Tabs */}
      <div className="sm:hidden mb-8">
        <div className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-700/50 dark:border-gray-600/50 transition-colors duration-300">
          <div className="grid grid-cols-1 gap-3 mb-3">
            {/* AI Coach - Botão destacado com informações detalhadas */}
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex flex-col items-center justify-center space-y-3 p-6 rounded-xl transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform hover:scale-105 ${
                activeTab === "chat" ? 'shadow-purple-500/50 scale-105' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 animate-pulse" />
                <div className="text-left">
                  <span className="text-lg font-bold block">🧠 IA Nutricional Avançada</span>
                  <span className="text-sm opacity-90">Chat com IA especializada em nutrição e emagrecimento</span>
                </div>
              </div>
              
              <div className="w-full bg-white/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3 h-3 text-yellow-300" />
                  <span className="font-medium">Média Prioridade</span>
                  <div className="ml-auto flex items-center gap-1 text-purple-200">
                    <Calendar className="w-3 h-3" />
                    <span>Próximo mês</span>
                  </div>
                </div>
                
                <div className="text-xs text-left">
                  <p className="font-medium mb-1">O que você pode esperar:</p>
                  <ul className="space-y-1 text-purple-100">
                    <li>• Análise nutricional personalizada</li>
                    <li>• Planos alimentares inteligentes</li>
                    <li>• Dicas baseadas no seu perfil</li>
                    <li>• Integração com dados do SB2 Turbo</li>
                  </ul>
                </div>
              </div>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {tabItems.filter(item => item.value !== "chat").map((item) => (
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
