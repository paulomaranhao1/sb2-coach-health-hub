
import { ReactNode } from 'react';
import { SkipNav } from '@/components/ui/skip-nav';

interface HomeOnlyLayoutProps {
  children: ReactNode;
}

const HomeOnlyLayout = ({ children }: HomeOnlyLayoutProps) => {
  const skipNavLinks = [
    { href: '#main-content', label: 'Pular para conteúdo principal' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SkipNav links={skipNavLinks} />
      
      <main 
        id="main-content"
        className="w-full min-h-screen"
        role="main"
        aria-label="Página inicial"
      >
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default HomeOnlyLayout;
