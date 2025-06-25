
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
    <div className="fixed inset-0 mobile-menu-overlay z-50 animate-fade-in" onClick={() => setShowMobileMenu(false)}>
      <div onClick={e => e.stopPropagation()} className="mobile-menu w-80 h-full shadow-2xl animate-slide-in-right transition-all duration-300 overflow-y-auto">
        {/* Header with modern dark theme */}
        <div className="mobile-menu-header sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-700 p-1">
                <img src="/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png" alt="SB2coach.ai" className="w-full h-full object-contain" />
              </div>
              <h2 className="font-semibold text-lg text-gray-100">SB2coach.ai</h2>
            </div>
            
            <Button onClick={() => setShowMobileMenu(false)} size="sm" variant="ghost" className="mobile-menu-header button h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Menu Principal */}
          <div>
            <div className="mobile-menu-section-title">Menu Principal</div>
            <MobileMenuNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
          </div>

          {/* Separador */}
          <div className="mobile-menu-separator border-t"></div>

          {/* Seção de Usuário */}
          <div>
            <div className="mobile-menu-section-title">Conta</div>
            <MobileMenuUserSection activeTab={activeTab} handleProfileClick={handleProfileClick} handleSettingsClick={handleSettingsClick} handleRoadmapClick={handleRoadmapClick} />
          </div>

          {/* Separador */}
          <div className="mobile-menu-separator border-t"></div>

          {/* Seção NOVO */}
          <div>
            <div className="mobile-menu-section-title">Novidades</div>
            <MobileMenuNewSection activeTab={activeTab} handleNewFeaturesClick={handleNewFeaturesClick} />
          </div>

          {/* Separador */}
          <div className="mobile-menu-separator border-t"></div>

          {/* Seção de Suporte */}
          <div>
            <div className="mobile-menu-section-title">Suporte</div>
            <MobileMenuSupportSection setShowMobileMenu={setShowMobileMenu} />
          </div>
        </div>

        {/* Footer do menu */}
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
