
import { ReactNode } from 'react';
import Header from './Header';
import MobileMenu from './MobileMenu';
import { SkipNav } from '@/components/ui/skip-nav';

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
  const skipNavLinks = [
    { href: '#main-content', label: 'Pular para conteúdo principal' },
    { href: '#navigation', label: 'Pular para navegação' },
    { href: '#footer', label: 'Pular para rodapé' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <SkipNav links={skipNavLinks} />
      
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

      <main 
        id="main-content"
        className="w-full px-0 py-0"
        role="main"
        aria-label="Conteúdo principal"
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
