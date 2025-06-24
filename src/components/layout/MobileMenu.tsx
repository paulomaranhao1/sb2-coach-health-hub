
import MobileMenuNavigation from "./mobile-menu/MobileMenuNavigation";
import MobileMenuUserSection from "./mobile-menu/MobileMenuUserSection";
import MobileMenuNewSection from "./mobile-menu/MobileMenuNewSection";
import MobileMenuSupportSection from "./mobile-menu/MobileMenuSupportSection";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  activeTab: string;
  handleTabChange: (value: string) => void;
}

const MobileMenu = ({ 
  showMobileMenu, 
  setShowMobileMenu, 
  activeTab, 
  handleTabChange
}: MobileMenuProps) => {
  const handleProfileClick = () => {
    handleTabChange('profile');
    setShowMobileMenu(false);
  };

  const handleSettingsClick = () => {
    handleTabChange('settings');
    setShowMobileMenu(false);
  };

  const handleRoadmapClick = () => {
    handleTabChange('roadmap');
    setShowMobileMenu(false);
  };

  const handleNewFeaturesClick = () => {
    handleTabChange('new-features');
    setShowMobileMenu(false);
  };

  if (!showMobileMenu) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" 
      onClick={() => setShowMobileMenu(false)}
    >
      <div 
        className="bg-gradient-to-br from-slate-50 via-white to-slate-100 w-80 h-full shadow-2xl animate-slide-in-right transition-all duration-300 overflow-y-auto border-r border-slate-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header moderno */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-4 border-b border-red-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-1 shadow-sm">
                <img 
                  src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
                  alt="SB2coach.ai" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-white font-bold text-lg">Menu</h2>
            </div>
            
            <Button
              onClick={() => setShowMobileMenu(false)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Menu Principal */}
          <div>
            <MobileMenuNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
          </div>

          {/* Separador elegante */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-medium">Perfil</span>
            </div>
          </div>

          {/* Seção de Usuário */}
          <div>
            <MobileMenuUserSection
              activeTab={activeTab}
              handleProfileClick={handleProfileClick}
              handleSettingsClick={handleSettingsClick}
              handleRoadmapClick={handleRoadmapClick}
            />
          </div>

          {/* Separador elegante */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-medium">Novidades</span>
            </div>
          </div>

          {/* Seção NOVO */}
          <div>
            <MobileMenuNewSection
              activeTab={activeTab}
              handleNewFeaturesClick={handleNewFeaturesClick}
            />
          </div>

          {/* Separador elegante */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-medium">Suporte</span>
            </div>
          </div>

          {/* Seção de Suporte */}
          <div className="pb-4">
            <MobileMenuSupportSection setShowMobileMenu={setShowMobileMenu} />
          </div>
        </div>

        {/* Footer do menu */}
        <div className="sticky bottom-0 bg-gradient-to-t from-slate-100 to-transparent p-4 mt-auto">
          <div className="text-center">
            <p className="text-xs text-slate-500">
              © 2024 SB2coach.ai
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Transformação inteligente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
