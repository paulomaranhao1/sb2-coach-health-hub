
import { ReactNode } from 'react';
import Header from './Header';
import MobileMenu from './MobileMenu';

interface AppLayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  activeTab: string;
  handleTabChange: (value: string) => void;
}

const AppLayout = ({
  children,
  theme,
  toggleTheme,
  showMobileMenu,
  setShowMobileMenu,
  activeTab,
  handleTabChange
}: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      <MobileMenu 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
