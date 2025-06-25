
import MonetizzeStyleMenu from "./mobile-menu/MonetizzeStyleMenu";

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
  return (
    <MonetizzeStyleMenu 
      showMobileMenu={showMobileMenu}
      setShowMobileMenu={setShowMobileMenu}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    />
  );
};

export default MobileMenu;
