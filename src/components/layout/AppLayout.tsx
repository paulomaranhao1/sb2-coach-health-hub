
import { ReactNode } from 'react';
import { SkipNav } from '@/components/ui/skip-nav';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const skipNavLinks = [
    { href: '#main-content', label: 'Pular para conteúdo principal' },
    { href: '#navigation', label: 'Pular para navegação' }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-700 m-0 p-0">
      <SkipNav links={skipNavLinks} />

      <main 
        id="main-content"
        className="w-full min-h-screen m-0 p-0"
        role="main"
        aria-label="Conteúdo principal"
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
