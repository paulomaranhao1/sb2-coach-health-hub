
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
      className="mobile-menu-overlay fixed inset-0 z-50 animate-fade-in" 
      onClick={() => setShowMobileMenu(false)}
    >
      <div 
        className="mobile-menu w-80 h-full shadow-2xl animate-slide-in-right transition-all duration-300 overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with solid red background */}
        <div className="mobile-menu-header sticky top-0 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 p-1 shadow-sm">
                <img 
                  src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" 
                  alt="SB2coach.ai" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="font-bold text-lg">Menu</h2>
            </div>
            
            <Button
              onClick={() => setShowMobileMenu(false)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-red-800 h-8 w-8 p-0 rounded-full bg-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 space-y-4">
          {/* Menu Principal */}
          <div>
            <MobileMenuNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
          </div>

          {/* Separador elegante - reduced spacing */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="mobile-menu-separator w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="mobile-menu-section-title px-2">Perfil</span>
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

          {/* Separador elegante - reduced spacing */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="mobile-menu-separator w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="mobile-menu-section-title px-2">Novidades</span>
            </div>
          </div>

          {/* Seção NOVO */}
          <div>
            <MobileMenuNewSection
              activeTab={activeTab}
              handleNewFeaturesClick={handleNewFeaturesClick}
            />
          </div>

          {/* Separador elegante - reduced spacing */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="mobile-menu-separator w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="mobile-menu-section-title px-2">Suporte</span>
            </div>
          </div>

          {/* Seção de Suporte */}
          <div className="pb-2">
            <MobileMenuSupportSection setShowMobileMenu={setShowMobileMenu} />
          </div>
        </div>

        {/* Footer do menu - reduced padding */}
        <div className="mobile-menu-footer sticky bottom-0 mt-auto">
          <div className="text-center">
            <p className="text-xs">
              © 2024 SB2coach.ai
            </p>
            <p className="text-xs mt-1">
              Transformação inteligente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
