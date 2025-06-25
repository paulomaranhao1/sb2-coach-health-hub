
import { X, Home, Package, Users, Play, TrendingUp, BarChart3, DollarSign, Settings, ShoppingCart, Map, Sparkles, Gift, HeadphonesIcon, HelpCircle, User, FileText, Shield, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const mainMenuItems = [
    { id: 'home', title: 'Painel inicial', icon: Home },
    { id: 'supplement', title: 'Suplementos', icon: Package },
    { id: 'intermittent-fasting', title: 'Jejum Intermitente', icon: Play },
    { id: 'calorie-counter', title: 'Contador de Calorias', icon: DollarSign },
    { id: 'statistics', title: 'Estatísticas', icon: TrendingUp },
    { id: 'gamification', title: 'Gamificação', icon: BarChart3 },
    { id: 'chat', title: 'IA Coach', icon: ShoppingCart },
    { id: 'roadmap', title: 'Roadmap', icon: Map },
  ];

  const specialItems = [
    { id: 'new-features', title: 'Novidades', icon: Sparkles, isSpecial: true },
    { id: 'offers', title: 'Ofertas Especiais', icon: Gift },
  ];

  const supportItems = [
    { id: 'support', title: 'Suporte', icon: HeadphonesIcon },
    { id: 'help', title: 'Ajuda', icon: HelpCircle },
  ];

  const accountItems = [
    { id: 'profile', title: 'Perfil', icon: User },
    { id: 'settings', title: 'Configurações', icon: Settings },
  ];

  const legalItems = [
    { 
      id: 'privacy-policy', 
      title: 'Política de Privacidade', 
      icon: Shield,
      onClick: () => {
        navigate('/privacy-policy');
        setShowMobileMenu(false);
      }
    },
    { 
      id: 'terms-of-service', 
      title: 'Termos de Uso', 
      icon: FileText,
      onClick: () => {
        navigate('/terms-of-service');
        setShowMobileMenu(false);
      }
    },
  ];

  const handleItemClick = (itemId: string, customOnClick?: () => void) => {
    if (customOnClick) {
      customOnClick();
    } else {
      handleTabChange(itemId);
      setShowMobileMenu(false);
    }
  };

  const handlePhotoUpload = () => {
    // Implementar upload de foto do perfil
    console.log('Upload de foto do perfil');
  };

  if (!showMobileMenu) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fade-in" 
      onClick={() => setShowMobileMenu(false)}
    >
      <div 
        className="w-80 h-full bg-white shadow-2xl animate-slide-in-right overflow-y-auto flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Perfil do Usuário */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">SB2coach.ai</h2>
            <Button
              onClick={() => setShowMobileMenu(false)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Perfil do Usuário */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src="" alt="Foto do perfil" />
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  U
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handlePhotoUpload}
                className="absolute -bottom-1 -right-1 bg-white text-red-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <p className="font-semibold">Usuário</p>
              <p className="text-sm text-white/80">user@example.com</p>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 p-4 space-y-6">
          {/* Navegação Principal */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Navegação Principal
            </h3>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                    isActive ? 'bg-red-50 text-red-600 border-l-4 border-red-500' : 'text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Destaques */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Destaques
            </h3>
            {specialItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    item.isSpecial 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500' 
                      : `hover:bg-gray-50 ${isActive ? 'bg-red-50 text-red-600 border-l-4 border-red-500' : 'text-gray-700'}`
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    item.isSpecial ? 'text-white' : (isActive ? 'text-red-500' : 'text-gray-500')
                  }`} />
                  <span className="font-medium">{item.title}</span>
                  {item.isSpecial && (
                    <div className="ml-auto">
                      <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">
                        NOVO
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Suporte */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Suporte
            </h3>
            {supportItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                    isActive ? 'bg-red-50 text-red-600 border-l-4 border-red-500' : 'text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Conta */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Conta
            </h3>
            {accountItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                    isActive ? 'bg-red-50 text-red-600 border-l-4 border-red-500' : 'text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Avisos Legais */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Avisos Legais
            </h3>
            {legalItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id, item.onClick)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 text-gray-700"
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer com Logout */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => {
              // Implementar logout
              console.log('Logout');
              setShowMobileMenu(false);
            }}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-red-50 text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
          
          <div className="mt-4 text-center">
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
