
import MobileMenuNavigation from "./mobile-menu/MobileMenuNavigation";
import MobileMenuUserSection from "./mobile-menu/MobileMenuUserSection";
import MobileMenuNewSection from "./mobile-menu/MobileMenuNewSection";
import MobileMenuSupportSection from "./mobile-menu/MobileMenuSupportSection";

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
      className="fixed inset-0 bg-black/50 z-50 animate-fade-in" 
      onClick={() => setShowMobileMenu(false)}
    >
      <div 
        className="bg-slate-800 w-64 h-full shadow-xl animate-slide-in-right transition-colors duration-300 overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-600">
          <h2 className="text-white font-semibold">Menu</h2>
        </div>
        
        <div className="p-4 space-y-2">
          {/* Menu Principal */}
          <MobileMenuNavigation activeTab={activeTab} handleTabChange={handleTabChange} />

          {/* Separador */}
          <div className="border-t border-slate-600 my-4"></div>

          {/* Seção de Usuário */}
          <MobileMenuUserSection
            activeTab={activeTab}
            handleProfileClick={handleProfileClick}
            handleSettingsClick={handleSettingsClick}
            handleRoadmapClick={handleRoadmapClick}
          />

          {/* Separador */}
          <div className="border-t border-slate-600 my-4"></div>

          {/* Seção NOVO */}
          <MobileMenuNewSection
            activeTab={activeTab}
            handleNewFeaturesClick={handleNewFeaturesClick}
          />

          {/* Separador */}
          <div className="border-t border-slate-600 my-4"></div>

          {/* Seção de Suporte */}
          <MobileMenuSupportSection setShowMobileMenu={setShowMobileMenu} />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
