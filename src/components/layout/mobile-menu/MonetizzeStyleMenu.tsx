
import { X, Home, Package, Users, Play, TrendingUp, BarChart3, DollarSign, Settings, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonetizzeStyleMenuProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  activeTab: string;
  handleTabChange: (value: string) => void;
}

const MonetizzeStyleMenu = ({ 
  showMobileMenu, 
  setShowMobileMenu, 
  activeTab, 
  handleTabChange
}: MonetizzeStyleMenuProps) => {
  const menuItems = [
    { id: 'home', title: 'Painel inicial', icon: Home, color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
    { id: 'supplement', title: 'Suplementos', icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'profile', title: 'Perfil', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 'intermittent-fasting', title: 'Jejum Intermitente', icon: Play, color: 'text-green-500', bgColor: 'bg-green-50' },
    { id: 'statistics', title: 'Estatísticas', icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { id: 'gamification', title: 'Gamificação', icon: BarChart3, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
    { id: 'calorie-counter', title: 'Contador de Calorias', icon: DollarSign, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { id: 'settings', title: 'Configurações', icon: Settings, color: 'text-gray-500', bgColor: 'bg-gray-50' },
    { id: 'chat', title: 'IA Coach', icon: ShoppingCart, color: 'text-red-500', bgColor: 'bg-red-50' },
  ];

  const handleItemClick = (itemId: string) => {
    handleTabChange(itemId);
    setShowMobileMenu(false);
  };

  if (!showMobileMenu) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fade-in" 
      onClick={() => setShowMobileMenu(false)}
    >
      <div 
        className="w-80 h-full bg-white shadow-2xl animate-slide-in-right overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h2 className="font-semibold text-gray-800 text-lg">SB2coach.ai</h2>
            </div>
            
            <Button
              onClick={() => setShowMobileMenu(false)}
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:bg-gray-100 h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center space-x-4 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                  isActive ? 'bg-cyan-50 border-l-4 border-cyan-400' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className={`font-medium ${isActive ? 'text-cyan-600' : 'text-gray-700'}`}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2024 SB2coach.ai
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Transformação inteligente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizzeStyleMenu;
