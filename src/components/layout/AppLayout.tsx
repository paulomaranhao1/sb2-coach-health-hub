
import { ReactNode } from 'react';
import Header from './Header';
import MobileMenu from './MobileMenu';

interface AppLayoutProps {
  children: ReactNode;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  activeTab: string;
  handleTabChange: (value: string) => void;
}

const AppLayout = ({
  children,
  showMobileMenu,
  setShowMobileMenu,
  activeTab,
  handleTabChange
}: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <MobileMenu 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
